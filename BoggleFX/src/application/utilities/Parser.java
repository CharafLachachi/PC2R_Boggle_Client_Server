package application.utilities;

import java.util.Arrays;

import javax.crypto.spec.PSource.PSpecified;

import application.respons.CMDResponsEnum;
import application.respons.ClientResponse;

public class Parser {
	public static ClientResponse ParseResponse(String rep) {
		String[] splitted = rep.split("/");
		switch (splitted[0]) {
		case "BIENVENUE":
			return new ClientResponse(CMDResponsEnum.BIENVENUE,Arrays.asList(Arrays.copyOfRange(splitted, 1, splitted.length -1)));
		default:
			break;
		}
		return null;
		
	}
}
