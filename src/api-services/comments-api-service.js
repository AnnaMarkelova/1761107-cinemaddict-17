import ApiService from '../framework/api-service.js';
//import { Method } from './const.js';

export default class CommentsApiService extends ApiService {
  get comments() {
    return this._load({url: 'comment'})
      .then(ApiService.parseResponse);
  }

  // updateTask = async (task) => {
  //   const response = await this._load({
  //     url: `tasks/${task.id}`,
  //     method: Method.PUT,
  //     body: JSON.stringify(task),
  //     headers: new Headers({'Content-Type': 'application/json'}),
  //   });

  //   const parsedResponse = await ApiService.parseResponse(response);

  //   return parsedResponse;
  // };
}
