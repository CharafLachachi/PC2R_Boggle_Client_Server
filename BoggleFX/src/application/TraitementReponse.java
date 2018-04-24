package application;

import java.io.BufferedReader;
import java.util.ArrayList;
import java.util.List;

import javafx.application.Platform;

public class TraitementReponse {
	private BufferedReader inchan;
	private SampleController gui;

	public TraitementReponse(BufferedReader inchan, SampleController gui) {
		super();
		this.inchan = inchan;
		this.gui = gui;
	}

	public void receive() {
		String ret;
		try {
			while (true) {
				ret = inchan.readLine();
				System.out.println("S -> C : " + ret);
				String cmd = ret.split("/")[0];
				String[] args = ret.split("/");
				cmd = cmd.trim();
				if (cmd.equals("BIENVENUE"))
					System.out.println("j'ai re�u un bienvenue");
				else if (cmd.equals("SESSION"))
					System.err.println();
				else if (cmd.equals("TOUR")) {
					Platform.runLater(() -> gui.setLetters(args[1]));
				} else if (cmd.equals("CONNECTE")) {
					Platform.runLater(() ->gui.addConnectedPlayer(args[1]));
				} else if (cmd.equals("BILANMOTS")) {
					String[] score = args[2].split("\\*");
					String tour = score[0];
					List<String> users = new ArrayList<>();
					List<String> scores = new ArrayList<>();
					for (int i = 1; i < score.length; i = i + 2) {
						users.add(score[i]);
						scores.add(score[i + 1]);
					}
					System.err.println(users + "\n");
					System.err.println(scores + "\n");
					gui.receiveTourScore(tour, users, scores);
					System.out.println("j'ai recu un bilanmots");
				}
				else if (cmd.equals("RECEPTION")) {
					Platform.runLater(() -> gui.receiveChatMessage("Public : " + args[1]));
				} else if (cmd.equals("PRECEPTION")) {
					Platform.runLater(() -> gui.receiveChatMessage(args[1]+" : " + args[2]));
				} else if (cmd.equals("DECONNEXION")) {
					Platform.runLater(() ->gui.removeConnectedPlayer(args[1]));
				} else if (cmd.equals("MVALIDE")) {
					Platform.runLater(()->gui.addValideWord(args[1]));
				}

			}
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}