import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.Socket;

public class Client {

    public static void main(String[] args) {
        try {
            Socket nodejs = new Socket("localhost", 8080);
            sendMessage(nodejs, "testnamespace");
            Thread.sleep(100);
            int x = 0;
            while (true)
            {
                sendMessage(nodejs, x + "");
                x++;
                Thread.sleep(1000);
                System.out.println(x + " has been sent to server");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static void sendMessage(Socket s, String message) throws IOException {
        s.getOutputStream().write(message.getBytes("UTF-8"));
        s.getOutputStream().flush();
    }

    public static String readMessage(Socket s) throws IOException {
        InputStream is = s.getInputStream();
        int curr = -1;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        while ((curr = is.read()) != -1) {
            if (curr == '\n') {
                break;
            }
            baos.write(curr);
        }
        return baos.toString("UTF-8");
    }
}