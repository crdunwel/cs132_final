##Technician Page
The technician page is designed to allow a sound engineer or fire manager (whatever their job title is) to manage the fire and speaker feedback. 

The main part of the page is a map, using google maps api. On the map, speakers/fires are shown using markers to show where they are. 

Clicking on a markers brings up information about that marker on an information pane on the side. The information is basically what the technician needs to make a decision to call someone to feed a fire or change volume of a speaker, namely the aggregated feedback from front-ends. This information changes in real time as feedback comes in.

The markers change color when the amount of feedback (either feed fire requests or net volume change requests) exceeds a certain threshold. This allows the technician to be alerted visually when a speaker or fire needs attention.

The thresholds can be changed by clicking the change threshold button. This is useful because we don't have data to determine what good thresholds would be, and allows the technician to adjust the threshold so that they aren't getting too many notifications and also getting enough.
