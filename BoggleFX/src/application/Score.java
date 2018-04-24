package application;

import javafx.beans.property.SimpleStringProperty;

public class Score {
	private final SimpleStringProperty tour;
	private final SimpleStringProperty name;
	private final SimpleStringProperty score;

	public Score(String tour, String lName, String score) {
	        this.tour = new SimpleStringProperty(tour);
	        this.name = new SimpleStringProperty(lName);
	        this.score = new SimpleStringProperty(score);
	    }

	public String getTour() {
		return tour.get();
	}

	public String getName() {
		return name.get();
	}

	public String getScore() {
		return score.get();
	}
	
}
