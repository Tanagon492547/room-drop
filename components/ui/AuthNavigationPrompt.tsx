import { Href, Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

type AuthNavigationPromptProps = {
  text: string | undefined;
  linkText: string | undefined;
  href: Href;
};

const AuthNavigationPrompt = ({ text, linkText, href }: AuthNavigationPromptProps) =>{
  return(
    <View style={styles.container}>
      <Text style={styles.text}>{text} </Text>
      <Link href={href ? href : '/'} style={styles.link}>
        <Text style={styles.linkText}>{linkText}</Text>
      </Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  text: {
    fontSize: 16,
    color: 'grey',
  },
  link: {
    // Style สำหรับ Link component โดยตรง (ถ้าจำเป็น)
  },
  linkText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007AFF', // <-- สีลิงก์มาตรฐาน
    textDecorationLine: 'underline',
  },
});

export default AuthNavigationPrompt;