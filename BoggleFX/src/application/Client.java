package application;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.Socket;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;


public class Client extends Thread{
	private BufferedReader reader;
	private DataOutputStream writer;
	/**Liste associative Mot-Trajectoire*/
	private Map<String,String> motsProposes ;
	private Socket ecouteSock;
	private String pseudo;
	private int score;
	private Connexion connexion;
	private TraitementReponse traitementReponse;
	//private BoggleGUI gui;
	
	
	public Client(Socket sock,String pseudo) {
		this.ecouteSock = sock;
		this.pseudo = pseudo;
		try {
			reader = new BufferedReader(new InputStreamReader(this.ecouteSock.getInputStream()));
			writer = new DataOutputStream(ecouteSock.getOutputStream());
			motsProposes = new HashMap<>();
			this.connexion = new Connexion(reader, writer,ecouteSock);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	public void run() {
		super.run();
		System.out.println("start client");
		this.connexion.connexionRequest(new ClientRequest(CMDRequestEnum.CONNEXION, Arrays.asList(this.pseudo)));
		//this.traitementReponse.receive();
	}
	
	
	public BufferedReader getReader() {
		return reader;
	}

	public void setReader(BufferedReader reader) {
		this.reader = reader;
	}

	public DataOutputStream getWriter() {
		return writer;
	}

	public void setWriter(DataOutputStream writer) {
		this.writer = writer;
	}

	public String getPseudo() {
		return pseudo;
	}

	public void setPseudo(String pseudo) {
		this.pseudo = pseudo;
	}
	

//	public static void main(String[] args) {
//		try {
//			Socket s = new Socket("192.168.210.120", 2018);
//			Client client = new Client(s, "Charaf");
//			client.start();
//		} catch (IOException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		}
//		
//	}
}