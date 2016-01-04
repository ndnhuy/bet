'use strict';

export default class ManagementController {
  /* @ngInject */
  constructor(TournamentService, CacheService, $rootScope, AccountService) {
    this.rootScope = $rootScope;
    this.tournamentService = TournamentService;
    this.accountService = AccountService;
    this.tournaments = [];
    this.getAllTournament();
    this.selectedGroup = -1;
    this.selectedTour = -1;
    this.showView = {
      isCreate: true,
      isEdit: false,
      isGroup: false
    };
    this.cacheService = CacheService;
    this.isAdmin = false;
    this.authen();
    $rootScope.$on('addTournament', () => {
      this.getAllTournament();
    });
  }

  changeTournament(index) {
    this.selectedTour = (index == this.selectedTour ? -1 : index);
  }

  createTournament() {
    this.showView.isCreate = true;
    this.showView.isEdit = false;
    this.showView.isGroup = false;
  }

  showGroup(index, data, groupID) {
    this.selectedGroup = index;
    this.showView.isCreate = false;
    this.showView.isEdit = false;
    this.showView.isGroup = true;
    this.rootScope.$broadcast('tourID', tournament.id, group.id);
    group.tournamentName = tournament.name;
    this.rootScope.$broadcast('selectGroup', group);
  }

  isAuthorized() {
    return this.cacheService.get('loginUser')!= null;
  }

  getAllTournament() {
    this.tournamentService.findByRole()
    .then(response => {
      this.tournaments = response.data;
    })
    .catch();
  }

  showTournamenDetail(tournamentId) {
    this.showView.isEdit = true;
    this.showView.isGroup = false;
    this.showView.isCreate = false;

    for (var i in this.tournaments)
    {
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
