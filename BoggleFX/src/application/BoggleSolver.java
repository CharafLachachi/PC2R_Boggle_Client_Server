package application;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

public class BoggleSolver {
	private Set<String> dictionary;
	private List<String> solutions;
	public BoggleSolver() {
		dictionary = new HashSet<String>();
		try {
			BufferedReader br = new BufferedReader(new FileReader(new File("/users/nfs/Etu7/3702337/git/Boggle/BoggleFX/Server/dictionnaire.dat")));
			String word;
			while ((word = br.readLine()) != null)
				dictionary.add(word.toUpperCase());
		} catch (IOException e) {
			e.printStackTrace();
		}
		solutions = new ArrayList<>();
	}
	public void game(char board[][]) {

		boolean visited[][] = new boolean[board.length][board[0].length];
		for (int i = 0; i < board.length; i++) {
			for (int j = 0; j < board[i].length; j++) {
				StringBuffer buffer = new StringBuffer();
				DFS(dictionary, board, visited, i, j, buffer);
			}
		}
	}

	private void DFS(Set<String> dictionary, char[][] board, boolean[][] visited, int i, int j, StringBuffer buffer) {
		if (i >= board.length || i < 0 || j < 0 || j >= board[i].length) {
			return;
		}

		if (visited[i][j] == true) {
			return;
		}
		visited[i][j] = true;
		buffer.append(board[i][j]);
		if (dictionary.contains(buffer.toString())) {
			solutions.add(buffer.toString());
		}

		for (int k = i - 1; k <= i + 1; k++) {
			for (int l = j - 1; l <= j + 1; l++) {
				DFS(dictionary, board, visited, k, l, buffer);
			}
		}
		buffer.deleteCharAt(buffer.length() - 1);
		visited[i][j] = false;
	}
	
	public String getSolution() {
		if (!solutions.isEmpty()) {
			return solutions.remove(0);
		}
		return null;
	}
	
}