import axios from 'axios';
import authHeader from './auth.header';

const API_URL = '/api/boards/';

class UserService {
    //post requests
    createBoard(name,description)
    {
        return axios.post(API_URL + "createboard", {
            name,
            description
        })
        .then(response => {            
            return response.data;
        }).catch(err=>{
            console.log(err);
            return err;
        });
    }
    
    updateBoard(data)
    {
        return axios.post(API_URL + "updateboard", {
            data
        })
        .then(response => {            
            return response.data;
        });
    }

    addtask(bid,taskName,taskDescription,taskUsers,taskStage)
    {
        return axios.post(API_URL + "addtask", {
            b_id:bid,
            task:{
                name:taskName,
                description:taskDescription,
                members:taskUsers,
                stage:taskStage
            }
        })
        .then(response => {            
            return response.data;
        });
    }

    updateTask(data)
    {
        return axios.post(API_URL + "updatetask", {
            data
        })
        .then(response => {            
            return response.data;
        });
    }

    //get requests
    getBoards()
    {
        return axios.get(API_URL,{ headers: authHeader() });
    }

    getBoard(id)
    {   
        return axios.get(API_URL+id+"/Dashboard",{ headers: authHeader() })
    }
    getDashboard(id)
    {
        return axios.get(API_URL+id+"/Dashboard",{ headers: authHeader() });
    }
}

export default new UserService();