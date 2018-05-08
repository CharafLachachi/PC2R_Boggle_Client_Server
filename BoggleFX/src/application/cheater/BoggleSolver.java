package application.cheater;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Stream;

public class BoggleSolver {
	private Set<String> dictionary;
	private List<String> solutions;
	public BoggleSolver() {
		dictionary = new HashSet<String>();
			try {
				Path path = Paths.get(getClass().getResource("dictionnaire.dat").toURI());
				Stream<String> lines = Files.lines(path);
			    lines.forEach(line -> dictionary.add(line.toUpperCase()));
			    lines.close();
			} catch (URISyntaxException | IOException e) {
				e.printStackTrace();
			}		
		solutions = new ArrayList<>();
		
	}
	public void game(char board[][]) {
		
		boolean visited[][] = new boolean[board.length][board[0].length];
		solutions.clear();
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