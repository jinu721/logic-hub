import User from "../../models/user.model";

export const generateUsername = async (name:string) => {


    let username = name.toLowerCase().replace(/[^a-zA-Z0-9._]/g, "");
    if (!username) username = "user";
    if (/^\d+$/.test(username)) username = "user";

    while (username.length < 3) {
        const extraChar = Math.random() < 0.5 ? "." : "_";
        username += extraChar + Math.floor(Math.random() * 10); 
    }

    username = username.substring(0, 20);

    let exists = await User.findOne({ username });

    while (exists) {
        const randomSuffix = Math.floor(Math.random() * 100); 
        const specialChar = Math.random() < 0.5 ? "." : "_"; 

        username = username.substring(0, 17) + specialChar + randomSuffix;

        exists = await User.findOne({ username });
    }

    return username;
};
