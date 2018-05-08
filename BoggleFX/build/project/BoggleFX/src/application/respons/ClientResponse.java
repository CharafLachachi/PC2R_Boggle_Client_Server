package application.respons;

import java.util.List;

public class ClientResponse {
		
		private CMDResponsEnum cmd;
		private List<String> args;
		
		public ClientResponse(CMDResponsEnum cmd, List<String> args) {
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


		public CMDResponsEnum getCmd() {
			return cmd;
		}


		public void setCmd(CMDResponsEnum cmd) {
			this.cmd = cmd;
		}


		public List<String> getArgs() {
			return args;
		}


		public void setArgs(List<String> args) {
			this.args = args;
		}
		
		
	}


