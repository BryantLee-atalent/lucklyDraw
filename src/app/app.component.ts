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

  drawing = false;
  lucklyUser: any;
  count = 0;
  num = 0; // 计数器
  lastId =  - 1 ; // 上一次选中的User
  constructor(private http: HttpClient, private modalService: NgbModal) {
      this.getAllUser();
  }

  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }

  restartUser() {
    this.getAllUser();
  }

  getAllUser() {
    const me = this;
    const url = 'https://wechat.atalent.xyz/backend/api/followers/LucklyUser';
    me.http.get(url).subscribe((data) => {
        me.data = data;

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

    me.drawIng(luckyNum, length, content);
  }

  drawIng(luckyNum: number, length: number, content: any) {
      const me = this;
      const userId = me.data[me.num].id;


      if (me.lastId !== -1) {
        document.getElementById('user' + me.lastId).style.backgroundColor = 'white';
      }
      document.getElementById('user' + userId).style.backgroundColor = 'black';

    if (me.count === luckyNum) {
    //  clearTimeout(me.drawIng);
      me.drawEnd(me.num, content);
    } else {
      if (me.count >= 0 && me.count < length) { // 第一轮转速最快
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 20);
      } else if (me.count >= length && me.count < length * 2) {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 100);
      } else if (me.count >= length * 2 && me.count < length * 3) {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 300);
      } else if (me.count >= length * 3 && me.count < length * 4) {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 500);
      } else {
        setTimeout(p => {
          me.drawIng(luckyNum, length, content);
        }, 800);
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
