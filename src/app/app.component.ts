import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any;
  speechData = '2018/06/08 10:30:00';
  speechNum = 1;
  drawing = false;
  lucklyUser: any;
  count = 0;
  num = 0; // 计数器
  lastId =  - 1 ; // 上一次选中的User
  classN: number;
  constructor(private http: HttpClient, private modalService: NgbModal) {
      this.getAllUser();

    const date = new Date();
    const date2 = new Date(this.speechData);
    if ((date.getTime() - date2.getTime()) > 0) {
      this.speechNum = 2;
    }
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  restartUser() {
    this.getAllUser();
  }

  getAllUser() {
    const me = this;
    const url = 'https://wechat.atalent.com/backend/api/followers/LucklyUser?speech=' + me.speechNum;
    me.http.get(url).subscribe((data) => {
        me.data = data;
        if(me.data.length < 13){
            me.classN = 1;
        }else if(me.data.length >= 13 && me.data.length < 30){
            me.classN = 2;
        }else if(me.data.length >= 31 && me.data.length < 73){
          me.classN = 3;
        }else {
            me.classN = 4;
        };
      if (!me.drawing) {
          setTimeout(() => {
            me.getAllUser();
          }, 2000); // 2S 刷新一次后台数据 抽奖时暂停
        }
    });
  }

  drawStart(content: any) {
    const me = this;
    me.drawing = true;

    // 开始抽奖
    const length = me.data.length;
    const cycle = length * 10;
    const max = length * 5;
    const min = length * 4;

    // 生成中奖粉丝
    const luckyNum  = Math.floor(Math.random() * (max - min + 1) + min);
    if(length > 0){
      me.drawIng(luckyNum, length, content);
    }
  }

  drawIng(luckyNum: number, length: number, content: any) {
      const me = this;
      const userId = me.data[me.num].id;


      if (me.lastId !== -1) {
        document.getElementById('user' + me.lastId).style.boxShadow = '0px 0px 35px 6px #fff';
        document.getElementById('user' + userId).style.zIndex = '0';
      }
      document.getElementById('user' + userId).style.boxShadow = '1px 1px 30px 9px #660064';
      document.getElementById('user' + userId).style.zIndex = '999';

    if (me.count === luckyNum) {
    //  clearTimeout(me.drawIng);
      me.drawEnd(me.num, content);
    } else {
      if (me.count >= 0 && me.count < length) { // 第一轮转速最快
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 2);
      } else if (me.count >= length && me.count < length * 2) {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 18);
      } else if (me.count >= length * 2 && me.count < length * 3) {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 36);
      } else if (me.count >= length * 3 && me.count < length * 4) {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 72);
      } else {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 144);
      }

      if (me.num === length - 1) {
        me.num = 0;
      } else {
        me.num++;
      }
      me.count++;
      me.lastId = userId;

    }
  }


  drawEnd(luckyNum: number, content: any) {
      const me = this;
      me.drawing = false;
      me.num = 0;
      me.count = 0;
      me.lastId = -1;

      me.lucklyUser = me.data[luckyNum];
      me.openVerticallyCentered(content);

      me.restartUser();
  }
}
