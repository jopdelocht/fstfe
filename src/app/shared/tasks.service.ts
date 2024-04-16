import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private router: Router, private http: HttpClient) { }

  tasksURL: string = 'http://localhost:8000/api/';

  // get tasks by gamecode
  async getTasksByGameCode(gameCode: number) {
    const response = await fetch(this.tasksURL + 'tasks-by-gamecode/' + gameCode);
    const tasksByGameCode = await response.json();
    return tasksByGameCode;
  }


  async createTaskDB(taskTitle: string, taskDescription: string, gameCode: string) {
    const token = localStorage.getItem('token');
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify({
        tasktitle: taskTitle,
        taskdescription: taskDescription,
        gamecode: gameCode
      })
    };
    try {
      // before proceeding
      const response = await fetch(this.tasksURL + 'createtaskupdatedatabase', options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      //console.log(data);
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  createTaskPusher(taskTitle: string, taskDescription: string, gameCode: string, taskId: number): void {
    this.http.post(this.tasksURL + 'createtaskupdatepusher', {
      tasktitle: taskTitle,
      taskdescription: taskDescription,
      gamecode: gameCode,
      taskid: taskId // Include the task ID in the request
    }).subscribe();
  }

  // Update tasks score inside the database
  async setTaskScoreUpdateDatabase(taskId: number, averageScore: number, lowestScore: number, highestScore: number) {
    const token = localStorage.getItem('token');
    const item = {
      averagescore: averageScore,
      lowestscore: lowestScore,
      highestscore: highestScore
    }
    const result = await fetch('http://localhost:8000/api/settaskscoreupdatedatabase/' + taskId, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'insomnia/2023.5.8',
        Authorization: 'Bearer ' + token
      },
      body: JSON.stringify(item)
    })
    if (!result.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await result.json();
    return data;
  }

  // Update tasks score (pusher)
  setTaskScoreUpdatePusher(taskId: number, averageScore: number, lowestScore: number, highestScore: number, gameCode: string) {
    this.http.patch('http://localhost:8000/api/settaskscoreupdatepusher', {
      taskid: taskId,
      averagescore: averageScore,
      lowestscore: lowestScore,
      highestscore: highestScore,
      gamecode: gameCode
    }).subscribe();
  }
}
