'use strict';
/* global angular */

export default class EditTournamentController {
  /* @ngInject */
  constructor(TournamentService, $rootScope, $modal, $mdDialog, toaster, AccountService, $stateParams, $location, MatchService) {
    this.tournamentService = TournamentService;
    this.matchService = MatchService;
    this.tournamentInfo = {};
    this.modal = $modal;
    this.mdDialog = $mdDialog;
    this.state = $stateParams;
    this.toaster = toaster;
    this.location = $location;
    this.inforTournament = [];
    this.accountService = AccountService;
    this.idScore1 = '';
    this.idScore2 = '';
    $rootScope.hideRound = true;
    $rootScope.hideInfo = true;
    this.checkRoundNull = false;
    this.isAdmin = false;
    this.authen();
    this.getById($stateParams.tournamentId);
    this.showInfoTournament($stateParams.tournamentId);
    this.roundInTournament();
    $rootScope.$on('newMatch', () => {
      this.showInfoTournament($stateParams.tournamentId);
    });
    this.lastUrl = this.location.path();
  }

  getById(tournamentId) {
    this.tournamentService.getById(tournamentId)
    .then(response => {
      this.tournamentInfo = response.data;
    })
    .catch(error => {
      if (error.status === 401) {
        this.location.path('/unauthorized').search({ lastUrl: this.lastUrl });
      }
    });
  }

  createGroup($event) {
    var self = this;
    this.mdDialog.show({
      controller: 'GroupController',
      controllerAs: 'groupCtrl',
      templateUrl: 'app/common/group/group.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose: true,
      resolve: {
        tournamentId: function () {
          return self.tournamentInfo.id;
        }
      }
    });
  }

  activeTournament() {
    this.tournamentService.active(this.tournamentInfo.id)
      .then(() => {
        this.tournamentInfo.activated = true;
        this.toaster.pop('success', null, 'app/components/tournament/edit-tournament/activeSuccess.html', null, 'template');
      })
      .catch(error => {
        if (error.status === 401) {
          this.location.path('/unauthorized').search({ lastUrl: this.lastUrl });
        }
        if (error.status === 403) {
          this.toaster.pop('error', 'Warning', error.data.message);
        }
      });
  }

  roundInTournament() {
    this.matchService.checkRoundCircle(this.state.tournamentId)
      .then(response => {
        this.checkRoundNull = response.data;
      });
  }

  showInfoTournament(tournamentId) {
    this.inforTournament = [];
    this.tournamentService.showInfoTournament(tournamentId)
      .then(response => {
        // Success
        var i;
        for (i = 0; i < response.data.length; i++) {
          this.inforTournament.push(response.data[i]);
        }
        this.checkNullScore();
        this.getTime();
      });
  }

  checkNullScore() {
    var i, j;
    for (i = 0; i < this.inforTournament.length; i++) {
      for (j = 0; j < this.inforTournament[i].matches.length; j++) {
        if (this.inforTournament[i].matches[j].score1 === null) {
          this.inforTournament[i].matches[j].score1 = '?';
        }
        if (this.inforTournament[i].matches[j].score2 === null) {
          this.inforTournament[i].matches[j].score2 = '?';
        }
      }
    }
  }

  getTime() {
    var i, j;
    for (i = 0; i < this.inforTournament.length; i++) {
      for (j = 0; j < this.inforTournament[i].matches.length; j++) {
        var timeString = this.inforTournament[i].matches[j].matchTime;
        this.inforTournament[i].matches[j].matchTime = this.formatTime(timeString[1].toString()) + '/' + this.formatTime(timeString[2].toString()) + '/' + timeString[0] +
        ', ' + this.formatTime(timeString[3].toString()) + ':' + this.formatTime(timeString[4].toString());
      }
    }
  }

  formatTime(time) {
    return (time.length === 2 ? time : '0' + time[0]);
  }

  openCreateRound() {
    var self = this;
    var roundOldData = {
      'roundId': null,
      'hide': false
    };
    this.modal.open({
      templateUrl: 'app/common/round-management/round-management.html',
      controller: 'RoundManController',
      controllerAs: 'round',
      resolve: {
        selectedRound: function () {
          return roundOldData;
        },
        tourID: function () {
          return self.tournamentInfo.id;
        }
      }
    });
  }

  openCreateMatch() {
    var self = this;
    this.modal.open({
      templateUrl: 'app/common/match/create-match/create-match.html',
      controller: 'CreateMatchController',
      controllerAs: 'createMatch',
      resolve: {
        editId: function () {
          return self.tournamentInfo.id;
        }
      }
    });
  }

  openUploadPhoto() {
    this.modal.open({
      templateUrl: 'app/common/upload-photo/upload-photo.html',
      controller: 'UploadPhotoController',
      controllerAs: 'uploadPhoto'
    });
  }

  openUpdateScore(match) {
    this.modal.open({
      templateUrl: 'app/common/match/update-score/update-score.html',
      controller: 'UpdateScoreController',
      controllerAs: 'updateScore',
      resolve: {
        getMatch: function () {
          return match;
        }
      }
    });
  }

  openUpdateRound(round) {
    var self = this;
    var roundOldData = {
      'roundId': round.id,
      'hide': true
    };
    this.modal.open({
      templateUrl: 'app/common/round-management/round-management.html',
      controller: 'RoundManController',
      controllerAs: 'round',
      resolve: {
        selectedRound: function () {
          return roundOldData;
        },
        tourID: function () {
          return self.tournamentInfo.id;
        }
      }
    });
  }

  authen() {
    this.accountService.authen()
      .then(response => {
        if (response.data) {
          this.isAdmin = response.data.role === 'ADMIN' ? true : false;
        }
      });
  }
}
