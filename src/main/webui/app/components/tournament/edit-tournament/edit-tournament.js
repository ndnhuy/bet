'use strict';
/* global angular */

export default class EditTournamentController {
  /* @ngInject */
  constructor(TournamentService, $rootScope, $modal, $mdDialog, toaster, CacheService) {
    this.tournamentService = TournamentService;
    this.tournamentInfo = {};
    this.modal = $modal;
    this.mdDialog = $mdDialog;
    this.toaster = toaster;
    this.isAdmin = CacheService.get('role') === 'ADMIN' ? true : false;
    $rootScope.$on('selectTournament', (event, tournamentInfo) => {
      this.tournamentInfo = tournamentInfo;
    });
  }

  createGroup($event) {
    this.mdDialog.show({
      controller: 'GroupController',
      controllerAs: 'groupCtrl',
      templateUrl: 'app/common/group/group.html',
      parent: angular.element(document.body),
      targetEvent: $event,
      clickOutsideToClose:true
    });
  }

  activeTournament() {
    this.tournamentService.active(this.tournamentInfo.id)
    .then(() => {
      this.tournamentInfo.activated = true;
      this.toaster.pop('success', null, 'app/components/tournament/edit-tournament/activeSuccess.html', null, 'template');
    })
    .catch(error => {
      if (error.status === 403) {
        this.toaster.pop('error', 'Warning', error.data.message);
      }
    });
  }

  openUpdateScore() {
    this.modal.open({
      templateUrl: 'app/common/match/update-score/update-score.html',
      controller: 'UpdateScoreController',
      controllerAs: 'updateScore'
    });
  }

  openCreateRound() {
    this.modal.open({
      templateUrl: 'app/common/round-management/round-management.html',
      controller: 'RoundManController',
      controllerAs: 'round'
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
}
