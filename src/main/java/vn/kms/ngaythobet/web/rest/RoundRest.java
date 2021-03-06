package vn.kms.ngaythobet.web.rest;

import static org.springframework.web.bind.annotation.RequestMethod.GET;
import static org.springframework.web.bind.annotation.RequestMethod.POST;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import vn.kms.ngaythobet.domain.tournament.Round;
import vn.kms.ngaythobet.domain.tournament.RoundService;
import vn.kms.ngaythobet.web.dto.CreateRoundInfo;
import vn.kms.ngaythobet.web.dto.UpdateRoundInfo;

@RestController
@RequestMapping("/api")
public class RoundRest {
    private final RoundService roundService;

    @Autowired
    public RoundRest(RoundService roundService) {
        this.roundService = roundService;
    }

    @RequestMapping(value = "/createRound", method = POST)
    public void createRound(@Valid @RequestBody CreateRoundInfo createRoundInfo) {
        roundService.createRound(createRoundInfo);
    }

    @RequestMapping(value = "/updateRound", method = POST)
    public void updateRound(@Valid @RequestBody UpdateRoundInfo updateRoundInfo) {
        roundService.updateRound(updateRoundInfo);
    }

    @RequestMapping(value = "/getRoundsInTournament/{tournament_id}", method = GET)
    public List<Round> getRoundInTournament(@PathVariable("tournament_id") Long tournament_id) {
        List<Round> rounds = roundService.getRoundByTournamentId(tournament_id);
        return rounds;
    }

    @RequestMapping(value = "/getRoundNameByBettingMatchId/{bettingMatchId}", method = GET)
    public String getRoundNameByBettingMatchId(@PathVariable("bettingMatchId") Long bettingMatchId) {
        return roundService.findByBettingMatchId(bettingMatchId).getName();
         
    }
}
