package application.cheater;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
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

			InputStream  in = BoggleSolver.class.getResourceAsStream("dictionnaire.dat");
			readFromInputStream(in);// marahch yseb fichier, oui je vois , kan nsayi ndir had projet andi f pc ? yatla3 ? oui, envois le bih b mafih ok douk nzidek f git wasm pseudo ta3ak nadirbelarouci c bn ?
			// vas y essay
			} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		solutions = new ArrayList<>();
		
	}
	private void readFromInputStream(InputStream inputStream)
			  throws IOException {
			    try (BufferedReader br
			      = new BufferedReader(new InputStreamReader(inputStream))) {
			        String line;
			        while ((line = br.readLine()) != null) {
			        	dictionary.add(line.toUpperCase());
			        }
			    }
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