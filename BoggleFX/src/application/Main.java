package application;
	
import javafx.application.Application;
import javafx.fxml.FXMLLoader;
import javafx.scene.Scene;
import javafx.scene.layout.BorderPane;
import javafx.stage.Stage;


public class Main extends Application {
	@Override
	public void start(Stage primaryStage) {
		try {	
			FXMLLoader fxml = new FXMLLoader(getClass().getResource("Sample.fxml"));
			BorderPane root = fxml.load();
			SampleController controller = fxml.getController();
			controller.init();
			//controller.setLetters("LIDAREJULTNEATNG");
			Scene scene = new Scene(root,1024,768);
			scene.getStylesheets().add(getClass().getResource("application.css").toExternalForm());
			primaryStage.setScene(scene);
			primaryStage.setResizable(false);
			primaryStage.show();
			
		} catch(Exception e) {
			e.printStackTrace();
		}
	}
	public static void main(String[] args) {
		launch(args);
	}
}
