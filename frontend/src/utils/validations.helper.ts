export const validation = (type:string,value:string)=>{
    switch(type){
        case 'username':
            if (!value) return "Username is required";
            if (value.length < 3) return "Username must be at least 3 characters";
            if (value.length > 20) return "Username must be less than 20 characters";
            if (!/^[a-zA-Z0-9._]+$/.test(value)) return "Username can only contain letters, numbers, dots and underscores";
            if (/^\d+$/.test(value)) return "Username cannot be all numbers";
            return "";
        case 'email':
            if (!value) return "Email is required";
            if (!/\S+@\S+\.\S+/.test(value)) return "Please enter a valid email address";
            return "";
        case 'password':
            if (!value) return "Password is required";
            if (value.length < 8) return "Password must be at least 8 characters";
            if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
            if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
            if (!/[0-9]/.test(value)) return "Password must contain at least one number";
            return "";
        case "identifier":
            if (!value) return "Identifier is required";
    }
}
