package application;

import java.io.IOException;
import java.net.Socket;
import java.util.Arrays;
import java.util.List;
import java.util.Observable;
import java.util.Observer;
import javafx.application.Platform;
import javafx.beans.value.ChangeListener;
import javafx.beans.value.ObservableValue;
import javafx.collections.FXCollections;
import javafx.collections.ObservableList;
import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.scene.Node;
import javafx.scene.control.Button;
import javafx.scene.control.Label;
import javafx.scene.control.ListView;
import javafx.scene.control.TableColumn;
import javafx.scene.control.TableView;
import javafx.scene.control.TextArea;
import javafx.scene.control.TextField;
import javafx.scene.control.cell.PropertyValueFactory;
import javafx.scene.layout.GridPane;

public class SampleController implements Observer{

	@FXML 
	private TextArea csArea;
	@FXML
	private GridPane boggleGrid;
	@FXML
	private Button A1;
	@FXML
	private Button A2;
	@FXML
	private Button A3;
	@FXML
	private Button A4;

	@FXML
	private Button B1;
	@FXML
	private Button B2;
	@FXML
	private Button B3;
	@FXML
	private Button B4;

	@FXML
	private Button C1;
	@FXML
	private Button C2;
	@FXML
	private Button C3;
	@FXML
	private Button C4;

	@FXML
	private Button D1;
	@FXML
	private Button D2;
	@FXML
	private Button D3;
	@FXML
	private Button D4;

	@FXML
	private Button submitWord;
	@FXML
	private Button login;
	@FXML
	private Button logout;

	@FXML
	private TextArea chatBox;
	@FXML
	private TextField chatMessage;
	@FXML
	private Button chatButton;
	@FXML
	private ListView<String> valideWord;
	@FXML
	private ListView<String> connectedPlayers;
	@FXML
	private TableView<Score> scoreTable;
	@FXML
	private TableColumn<Score, String> tourColumn;
	@FXML
	private TableColumn<Score, String> userColumn;
	@FXML
	private TableColumn<Score, String> scoreColumn;
    @FXML
	private Label timer;
    @FXML
	private TextField username;
    @FXML
	private TextField ipText;
    @FXML
	private TextField portText;
    
    @FXML 
    private Label tricheText;
    
    @FXML
	private Button tricheBtn;
	@FXML


	private Client client;
	private Socket socket;
	private TraitementReponse traitementReponse;
	private TraitementRequetes traitementRequetes;
	private char[][] letters;
	private String word = "";
	private String trajectoire = "";
	private ObservableList<String> items = FXCollections.observableArrayList();
	private ObservableList<String> players = FXCollections.observableArrayList();
	private ObservableList<Score> scores = FXCollections.observableArrayList();
	private MyTimer myTimer;
	private BoggleSolver solver;
	private static int PORT = 2018;
	private static String IP = "127.0.0.1";
	private String messageReceiver = "All";
	
	public void init() {
		try {
			//this.socket = new Socket("132.227.112.132", 2020);
			letters = new char[4][4];
			Platform.runLater(() -> valideWord.setItems(items));
			Platform.runLater(() -> connectedPlayers.setItems(players));
			tourColumn.setCellValueFactory(new PropertyValueFactory<Score, String>("tour"));
			userColumn.setCellValueFactory(new PropertyValueFactory<Score, String>("name"));
			scoreColumn.setCellValueFactory(new PropertyValueFactory<Score, String>("score"));
			Platform.runLater(() -> {
				players.add(messageReceiver);
				scoreTable.setItems(scores);
				portText.setText(String.valueOf(PORT));
				ipText.setText(IP);
				connectedPlayers.getSelectionModel().selectedItemProperty().addListener(new ChangeListener<String>() {
				    @Override
				    public void changed(ObservableValue<? extends String> observable, String oldValue, String newValue) {
//				        System.out.println("ListView selection changed from oldValue = " 
//				                + oldValue + " to newValue = " + newValue);
				    	messageReceiver = newValue;
				    }
				});
			});
			solver = new BoggleSolver();

		} catch (Exception e) {
			e.printStackTrace();
		}

	}
    @Override
    public void update(Observable o, Object arg) {
        Platform.runLater(() -> timer.setText((String) arg));
    }
	public void connect(String username) {
		try {
			this.socket = new Socket(IP, PORT);
		} catch (IOException e) {
			e.printStackTrace();
		}
		client = new Client(this.socket, username.toUpperCase());
		client.start();
		traitementReponse = new TraitementReponse(client.getReader(), this);
		traitementRequetes = new TraitementRequetes(client.getWriter());
		traitementReponse.start();

	}

	private Button get(int i, int j) {
		// GridPane grid = new GridPane();
		for (Node n : boggleGrid.getChildren()) {
			if (n instanceof Button)
				if (j == GridPane.getColumnIndex(n) && GridPane.getRowIndex(n) == i) {
					return (Button) n;
				}
		}
		return null;
	}
	public void setTimer(int time) {
		myTimer = new MyTimer(time, this);
	}
	public void setLetters(String tirage) {
		System.out.println("controller " + tirage);
		for (int i = 0; i < 4; i++) {
			for (int j = 0; j < 4; j++) {
				get(i, j).setText(String.valueOf(tirage.charAt(0)));
				letters[i][j] = tirage.charAt(0);
				tirage = tirage.substring(1, tirage.length());
			}
		}
		solver.game(letters);
		myTimer.restart();
	}

	public void receiveChatMessage(String message) {
		chatBox.appendText(message + "\n");
	}

	public void sendChatMessage(ActionEvent e) {
		if(messageReceiver.equals("All")) {
		traitementRequetes.sendMessage(chatMessage.getText());
		csArea.appendText("C -> S :"+chatMessage.getText() +"\n");
		chatBox.appendText("YOU :" + chatMessage.getText() + "\n");
		}
		else {
		traitementRequetes.sendPrivateMessage(chatMessage.getText(), messageReceiver);
		csArea.appendText("C -> S :"+chatMessage.getText() +"\n");
		chatBox.appendText("YOU to "+messageReceiver.toUpperCase()+" : " + chatMessage.getText() + "\n");
		}
		chatMessage.clear();
	}

	public void receiveTourScore(String tour, List<String> users, List<String> scores) {
		for (int i = 0; i < users.size(); i++) {
			if (users.get(i).equals(client.getPseudo().toUpperCase())) {
				client.setScore(scores.get(i));
			}
			Score score = new Score(tour, users.get(i), scores.get(i));
			this.scores.add(score);
		}
	}

	public void addValideWord(String word) {
		items.add(word);
	}

	public void boggleClickButton(ActionEvent e) {
		Button btn = ((Button) e.getSource());
		String cell = btn.getText();
		String cellId = btn.getId();
		btn.setStyle("-fx-background-color:#707070,linear-gradient(#fcfcfc, #f3f3f3),linear-gradient(#f2f2f2 0%, #ebebeb 49%, #dddddd 50%, #cfcfcf 100%);-fx-background-insets: 0,1,2;-fx-background-radius: 3,2,1;-fx-padding: 3 30 3 30;-fx-text-fill: black; -fx-font-size: 14px; ");
		
		if (!trajectoire.contains(cellId)) {
			word += cell;
			trajectoire += cellId;
		}
		

	}

	public void addConnectedPlayer(String name) {
		players.add(name);
	}

	public void removeConnectedPlayer(String name) {
		players.remove(name);
	}

	public void submitBoggleWord(ActionEvent e) {
		traitementRequetes.sendWord(word + "/" + trajectoire);
		csArea.appendText("C -> S :"+word + "/" + trajectoire +"\n");
		System.err.println(word);
		System.err.println(trajectoire);
		trajectoire = "";
		word = "";
		resetButtonStyle();

	}
	public void newWordReset(ActionEvent e) {
		trajectoire = "";
		word = "";
		resetButtonStyle();
	}
	
	public void logIn(ActionEvent e) {
		if (portText.getText().length() > 0 && ipText.getText().length() > 0) {
		PORT = Integer.valueOf(portText.getText());
		IP = ipText.getText();
		}
		connect(username.getText());
		username.setEditable(false);
	}
	public void logOut(ActionEvent e) {
		String req = new ClientRequest(CMDRequestEnum.SORT,Arrays.asList(this.client.getPseudo())).writeString();
		this.traitementRequetes.sendToServer(req);
		csArea.appendText("C -> S :"+req+"\n");
		traitementReponse.interrupt();
		
	}
	
	public void tricher(ActionEvent e) {
		tricheText.setText(solver.getSolution());
	}
	
	public void addMessage(String text) {
		csArea.appendText(text);
	}
	public void resetButtonStyle() {
		A1.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		A2.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		A3.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		A4.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
	
		B1.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		B2.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		B3.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		B4.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
	
		C1.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		C2.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		C3.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		C4.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
	
		D1.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		D2.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		D3.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
		D4.setStyle("-fx-background-color: #3c7fb1,linear-gradient(#fafdfe, #e8f5fc),linear-gradient(#eaf6fd 0%, #d9f0fc 49%, #bee6fd 50%, #a7d9f5 100%);");
	}
	public void addConnectedPlayers(String[] args) {
		for (int i = 1; i < args.length; i++) {
			if (!args[i].toLowerCase().equals(username.getText().toLowerCase())) {
				players.add(args[i]);
			}
		}
	}
}
