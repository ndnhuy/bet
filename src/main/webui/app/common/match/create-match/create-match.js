'use strict';

export default class CreateMatchController {
  /* @ngInject */
  constructor(MatchService, CacheService, $location, $modalInstance, toaster, editId) {
    this.matchService = MatchService;
    this.cacheService = CacheService;
    this.location = $location;
    this.modalInstance = $modalInstance;
    this.toaster = toaster;
    this.data = {};
    this.dataRounds = [];
    this.dataCompetitors = [];
    this.tournamentId = editId;
    this.getRounds();
  }

  createMatch() {
    var self = this;
    this.popTitle = 'Create new match';
    var successMessage = 'Create match successfully!';
    // Show alert message
    this.pop = function (type, title, content) {
      this.toaster.pop(type, title, content);
    };
    var time = this.data.time;
    this.data.time = this.formatTime(this.data.time);
    this.matchService.createMatch(this.data)
      .then(response => {
        
        // Success
        this.closeModal();
        this.pop('success', this.popTitle, successMessage);
        this.data = {};
        successMessage = '';
      })
      .catch(response => {
        self.data.time = time;
        // return error
        if (response.data.message) {
          self.pop('error', self.popTitle, response.data.message);
        }
        self.errorMessage = response.data.fieldErrors;
      });
  }

  getRounds() {
    this.matchService.getRounds(this.tournamentId)
      .then(response => {
        // Success
        var i;
        for (i = 0; i < response.data.length; i++) {
          this.dataRounds.push(response.data[i]);
        }
      });
  }

  getCompetitors() {
    this.dataCompetitors = [];
    this.matchService.getCompetitors(this.data.round)
      .then(response => {
        
        // Success
        var i;
        for (i = 0; i < response.data.length; i++) {
          this.dataCompetitors.push(response.data[i]);
        }
      });
  }

  formatTime(time) {
    var timeFormat = new Date(time);
    var getYear = timeFormat.getFullYear(),
      getMonth = (timeFormat.getMonth() + 1).toString(),
      getDate = timeFormat.getDate().toString(),
      getHour = timeFormat.getHours().toString(),
      getMinute = timeFormat.getMinutes().toString();
    return getYear + '-' + (getMonth.length === 2 ? getMonth : '0' + getMonth[0]) + '-' + (getDate.length === 2 ? getDate : '0' + getDate[0]) + 'T' +
      (getHour.length === 2 ? getHour : '0' + getHour[0]) + ':' + (getMinute.length === 2 ? getMinute : '0' + getMinute[0]);
  }

  closeModal() {
    this.modalInstance.dismiss();
    this.data = {};
  }
}