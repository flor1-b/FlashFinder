export const getUserImageSrc = imagePath => {
    if (imagePath){
        return {uri: imagePath}
    } else {
        return require('../assets/images/defaultProfilePic.png');
    }
}

export const uploadFile = async (forceTouchHandlerName, fileUri, isImage=true)=>{
    try{

    }catch(error){
        console.log('Error Uploading File: ', error);
        return {success: false, msg: 'Error Uploading File'}
    }
}