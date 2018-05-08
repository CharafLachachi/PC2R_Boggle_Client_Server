package application.request;

import java.io.DataOutputStream;
import java.io.IOException;
import java.text.Normalizer;

public class TraitementRequetes {
	private DataOutputStream outChan;
	
	public TraitementRequetes(DataOutputStream outChan) {
		 this.outChan = outChan;
	}
	
	public void sendWord(String word) {
		sendToServer("TROUVE/"+word);
	}
	
	public void sendMessage(String word) {
		sendToServer("ENVOI/"+word);
	}
	public void sendPrivateMessage(String word,String user) {
		sendToServer("PENVOI/"+user+"/"+word);
	}
	
	public void sendToServer(String msg) {
		if((msg != null) && !(msg.equals(""))) {
			System.out.println(msg);
			try {
				msg = Normalizer.normalize(msg, Normalizer.Form.NFD);
				msg = msg.replaceAll("[^\\p{ASCII}]", "");
				msg+='\n';
				outChan.write(msg.getBytes());
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	
}
