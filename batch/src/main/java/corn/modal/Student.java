package corn.modal;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.StringUtils;

import javax.persistence.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.DecimalFormat;
import java.text.NumberFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Data
@Entity
@Table(name = "student")
@NoArgsConstructor
@AllArgsConstructor
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    private String name;
    private Integer age;
    private String sex;
    private String address;
    private Integer cid;

    public static void main(String[] args) {
        Double flowLimited = 123456/1000D;
//        System.out.println(String.format("%s TB",flowLimited));
//        System.out.println(String.format("%.2f TB",flowLimited));

        BigDecimal bd = new BigDecimal(flowLimited);
        bd = bd.setScale(2, RoundingMode.HALF_UP);
//        System.out.println(bd.toString());

        DecimalFormat df  = new DecimalFormat("0.00");
//        System.out.println(df.format(flowLimited));

        NumberFormat nf = NumberFormat.getNumberInstance();
        nf.setMaximumFractionDigits(2);
        System.out.println(nf.format(1.2D));//1.2
        System.out.println(nf.format(1.233D));//1.23
        System.out.println(nf.format(1D));//1


        String value = "15.00";
        String value1 = "15.11";
        String value3 = "0.10";
        String value4 = "0.01";
        String reg = "^(\\d+).(\\d*?)0*$";
        Pattern r = Pattern.compile(reg);
        Matcher m = r.matcher(value4);
        if (m.find( )) {
            String a = m.group(1) ;
            String b = m.group(2) ;
            if(StringUtils.isNotBlank(b)){
                System.out.println(a+"."+b);
            }else {
                System.out.println(a);
            }
        } else {
            System.out.println("NO MATCH");
        }
    }
}
