package application.cheater;

import java.util.List;

public class SolutionCheat {
	private List<Coordinate> trajectoire;
	private String mot;
	
	public SolutionCheat(List<Coordinate> trajectoire, String mot) {
		super();
		this.trajectoire = trajectoire;
		this.mot = mot;
	}
	public List<Coordinate> getTrajectoire() {
		return trajectoire;
	}
	public void setTrajectoire(List<Coordinate> trajectoire) {
		this.trajectoire = trajectoire;
	}
	public String getMot() {
		return mot;
	}
	public void setMot(String mot) {
		this.mot = mot;
	}
	
}
