import { StyleSheet } from "react-native";
import { Colors } from "./../../constants/color/Colors"; 

export default StyleSheet.create({
    container: {
        marginTop: -25,
        backgroundColor: Colors.White,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        height: '100%',
        padding: 15,
    },
    imgs: {
        width: '100%',
        height: 350,
    },
    txt_title: {
        fontSize: 30,
        fontWeight: 'bold',
        fontFamily: 'OpenSans-SemiBoldItalic',
        margin: 5,
        textAlign: 'center'
    },
    txt_content: {
        fontSize: 15,
        fontFamily: 'OpenSans-Medium',
        padding: 5,
        margin: 5,
        color: Colors.Gray
    },
    button: {
        padding: 10,
        margin: 20,
        backgroundColor: Colors.Button,
        borderRadius: 15,
    },
    buttonNoFill: {
        padding: 10,
        margin: 20,
        borderRadius: 15,
    },
    input: {
        padding: 10, 
        borderWidth: 1, 
        borderRadius: 15, 
        borderColor: Colors.Gray,
        marginTop: 5,
        marginRight: 20,
        marginBottom: 20,
    },
    avatar: {
        maxWidth: 40, 
        maxHeight: 40, 
        backgroundColor: "white",
        borderWidth: 2, 
        borderRadius: 15, 
        borderColor: Colors.LightGray,          
        alignSelf: 'left', 
        margin: 20, 
        minHeight: 40,
        padding: 40
    },
    editIcon: {
        position: 'absolute',
        left: 90,
        top: -40,
        padding: 7,
        borderRadius: 50,
        backgroundColor: "white", 
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        elevation: 7,
    },
    shadow: {
        borderRadius: 20,
        shadowRadius: 20,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.4,
        elevation: 7,
    },
    shadowRight: {
        shadowColor: 'gray', // Shadow color
        shadowOffset: { width: 4, height: 0 }, // Move shadow to the right
        shadowOpacity: 0.4, // Adjust opacity
        shadowRadius: 10, // Adjust blur radius
        elevation: 15, // For Androi
    },
    shadowAll: {
        shadowColor: 'gray', // Shadow color
        shadowOffset: { width: 0, height: 10 }, // Move shadow to the right
        shadowOpacity: 0.7, // Adjust opacity
        shadowRadius: 10, // Adjust blur radius
        elevation: 15, // For Androi
    },
    nav: {
        flex: 1,
        padding: 20,
        marginTop: 15,
        backgroundColor: "white",
        maxHeight: '30%'
    },
    buttonBack: {
        backgroundColor: Colors.LightGray,
        borderRadius: 7,
        width: 30,
        height: 30,
    },
    richBar: {
        padding: 10, 
        borderWidth: 1, 
        borderRadius: 15, 
        borderColor: Colors.Gray,
        marginTop: 5,
        marginRight: 20,
        marginBottom: 20,
        paddingBottom: 100,
        maxHeight: 285,
    }, 
    file: {
        maxHeight: 100,
        width: '100%',
        borderRadius: 15,
        overflow: "hidden",
        borderCurve: 'continuous',
    },
    post: {
        minHeight: 100,
        maxHeight: 300,
        backgroundColor: "white",
        borderWidth: 2,
        borderRadius: 20,
        borderColor: Colors.LightGray,
        shadowRadius: 5,
        shadowOffset: {width: 4, height: 4},
        shadowOpacity: 0.4,
        elevation: 10,
        shadowRadius: 35,
        marginBottom: 10,
    },
    contentPost: {
        padding: 20,
        fontSize: 15,
        textAlign: 'justify', 
    },
    imgsPost: {
        width: '100%',
        height: 190,
        borderRadius: 20,
        marginTop: 10,
        alignSelf: 'center'
    },
    imgsContainer: {
        marginLeft: 20, 
        marginRight: 20,
        marginBottom: 10
    }, 
    likeContainer: {
        padding: 0, 
        marginLeft: 10,
    },
    txt_count: {
        paddingTop: 13,
        paddingBottom: 10,
        marginRight: 5,
    },
    img_banner: {
        width: '100%',
        height: 80,
        borderRadius: 10,
    },
    banner_container:{
        backgroundColor: "white",
        borderRadius: 15,
        marginTop: 10,
    },
    textInputFocused: {
        marginRight: 0, // Take up remaining space
    },
    inputBorder: {
        borderWidth: 1, 
        borderRadius: 10,
        borderColor: Colors.LightGray
    },
    overlay: {
        flex: 1,
        backgroundColor: "black",
        opacity: 0.5,
    },
    popupMenuFilter: {
        minWidth: 100,
        minHeight: "auto",
        maxHeight: "100%",
        maxWidth: "100%",
        backgroundColor: "white",
        padding: 10, 
        position: "absolute",
        top: 155,
        left: 15,
        
        borderRadius: 10,
        shadowColor: "black",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    menuItem: {
        width: 130,
        backgroundColor: "#EEEEEE",
        margin: 5,
        marginTop: 8,
        borderWidth: 1.4,
        borderRadius: 5
    }
});