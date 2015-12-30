'use strict';

export default class ManagementController {
  /* @ngInject */
  constructor(TournamentService, CacheService, $rootScope, AccountService) {
    this.rootScope = $rootScope;
    this.tournamentService = TournamentService;
    this.accountService = AccountService;
    this.tournaments = [];
    this.getAllTournament();
    this.showView = {
      isCreate: true,
      isEdit: false,
      isGroup: false,
      isPlayerBettingMatch: true
    };
    this.selected = -1;
    this.cacheService = CacheService;
    this.isAdmin = false;
    this.authen();
    $rootScope.$on('addTournament', () => {
      this.getAllTournament();
    });
  }

  select(index) {
    this.selected = index;
  }

  createTournament() {
    this.showView.isCreate = true;
    this.showView.isEdit = false;
    this.showView.isGroup = false;
  }

  createGroup() {
    this.showView.isCreate = false;
    this.showView.isEdit = false;
    this.showView.isGroup = true;
    console.log('asdfasfd');
  }

  playerBettingMatch() {
    this.showView.isCreate = false;
    this.showView.isEdit = false;
    this.showView.isGroup = false;
    this.isPlayerBettingMatch = true
  }

  isAuthorized() {
    return this.cacheService.get('loginUser') != null;
  }

  getAllTournament() {
    this.tournamentService.getAll()
      .then(response => {
        this.tournaments = response.data;
      })
      .catch();
  }

  showTournamenDetail(tournamentId) {
    this.showView.isEdit = true;
    this.showView.isGroup = false;
    this.showView.isCreate = false;

    for (var i in this.tournaments) {
      if (this.tournaments[i].id === tournamentId) {
        this.rootScope.$broadcast('selectTournament', this.tournaments[i]);
        break;
      }
    }
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