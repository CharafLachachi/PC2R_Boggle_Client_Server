package application.request;

import java.util.List;

public class ClientRequest {
	
	private CMDRequestEnum cmd;
	private List<String> args;
	
	public ClientRequest(CMDRequestEnum cmd, List<String> args) {
		this.cmd = cmd;
		this.args = args;
	}
	
	
	public String writeString() {
		StringBuilder builder = new StringBuilder();
		builder.append(cmd);
		for (String string : args) {
			builder.append("/"+string);
		}
		return builder.toString();
	}


	public CMDRequestEnum getCmd() {
		return cmd;
	}


	public void setCmd(CMDRequestEnum cmd) {
		this.cmd = cmd;
	}


	public List<String> getArgs() {
		return args;
	}


	public void setArgs(List<String> args) {
		this.args = args;
	}
	
	
}
