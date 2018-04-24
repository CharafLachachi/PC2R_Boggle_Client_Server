package application;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.net.Socket;
import java.text.Normalizer;


public class Connexion {
	private BufferedReader inCh;
	private DataOutputStream outCh;
	private Socket ecouteSocket;
	
	public Connexion(BufferedReader inCh, DataOutputStream outCh, Socket ecouteSocket) {
		this.inCh = inCh;
		this.outCh = outCh;
		this.ecouteSocket = ecouteSocket;
	}
	
	public void connexionRequest(ClientRequest req) {
		try {
			System.err.println(req.writeString());
			sendToServer(req.writeString());
			outCh.flush();
			
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

	public void sendToServer(String msg) {
		if((msg != null) && !(msg.equals(""))) {
			System.out.println(msg);
			try {
				msg = Normalizer.normalize(msg, Normalizer.Form.NFD);
				msg = msg.replaceAll("[^\\p{ASCII}]", "");
				msg+='\n';
				outCh.write(msg.getBytes());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}
	
	
}
