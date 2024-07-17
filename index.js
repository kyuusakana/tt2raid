window.wx = undefined;
new Vue({
	el:'app',
	data:{
		title:'',
		tab:'table',
		output:[],
		flag:'25',
		finish:false,
		sort:'dsd',
		copytext:'',
		iscopy:false,
		dis:{
			show:false,
			output:[],
			flag:'25',
			finish:false,
		},
		catchpart:{
			model:'part',
			list:[
				{
					id:null,
					name:'默认',
					list:[],
				}
			],
			active:null,
		},
		catchdata:{
			show:false,
			type:null,
			list:[],
			item:null,
		},
		areabox:{
			show:false,
			type:null,
			text:'',
			hold:'',
		},
		pageobs:null,
		poa2:{
			show:false,
			th2:{
				transform: 'translateY(0rem)',
			},
		},
		inpshow:false,
		disshow:false,
		chart:null,
		ischart:false,
		isbelow:false,
		belowdata:[],
		chartoption:null,
		ischartuser:false,
		updatetext:[
			{
				title:'V0.1.27',
				con:[
					'• 特性：增加记录分组功能和选部分记录功能。',
					'• 修复：修复部分情况表格显示问题。',
				],
			},
			{
				title:'V0.1.26',
				con:[
					'• 优化：更换折线图筛选项功能。',
				],
			},
			{
				title:'V0.1.25',
				con:[
					'• 优化：修改次数的贡献计算方式。',
				],
			},
			{
				title:'V0.1.24',
				con:[
					'• 优化：均伤图表和贡献排名新开标签。',
					'• 优化：贡献排名增加导出图片功能。',
				],
			},
			{
				title:'V0.1.23',
				con:[
					'• 特性：增加贡献排名功能，综合历史所有合格情况。',
					'• 优化：从记录取列表显示士气。',
				],
			},
			{
				title:'V0.1.22',
				con:[
					'• 特性：增加折线图统计功能。',
				],
			},
			{
				title:'V0.1.21',
				con:[
					'• 优化：修正对比数据计算参数。',
					'• 修复：修复表格中的旗子不跟随输入框变化问题。',
				],
			},
			{
				title:'V0.1.20',
				con:[
					'• 特性：增加调整记录顺序功能。',
					'• 特性：增加表格生成图片功能。',
					'• 修复：修复表格无法复制问题。',
				],
			},
			{
				title:'V0.1.19',
				con:[
					'• 特性：增加日志标签页。',
				],
			},
			{
				title:'V0.1.18',
				con:[
					'• 特性：增加标签页切换功能，增加说明标签页。',
					'• 特性：增加均伤数据对比。',
					'• 特性：从记录取的数据作为当前记录的选中项。',
					'• 特性：记录可以自定义标题。',
					'• 优化：修改文本描述，缓存改为记录。',
					'• 优化：统计和对比数据按钮移到界面右下角。',
					'• 优化：把记录管理单独成标签，记录导入导出按钮移到记录标签里。',
					'• 修复：修复表格滚动时表头消失问题。',
				],
			},
			{
				title:'V0.0.17',
				con:[
					'• 修复：修复总伤为0时均伤计算错误问题。',
				],
			},
		],
	},
	computed:{
		omit(){
			return function(v){
				return (v/1000000).toFixed(2);
			};
		},
		maxqty(){
			let num=0;
			for(let item of this.output){
				num=Math.max(num,item.qty);
			};
			return num;
		},
		admg(){
			let num=0;
			for(let item of this.output){
				num+=item.dmg;
			};
			return num/this.output.length;
		},
		aavg(){
			let num=0;
			for(let item of this.output){
				num+=item.avg;
			};
			return num/this.output.length;
		},
		qcolor(){
			return function(v){
				let color='';
				if(v==this.maxqty){
					color='#3399FF';
				};
				if(v<this.maxqty-6){
					color='#EE5555';
				};
				return color;
			};
		},
		dcolor(){
			return function(v){
				let color='';
				if(v<=10){
					color='#3399FF';
				};
				if(v==this.output.length){
					color='#EE5555';
				};
				return color;
			};
		},
		ncolor(){
			return function(v,n){
				let num=0;
				let color='';
				if(v=='#3399FF'){
					num++;
				};
				if(v=='#EE5555'){
					num--;
				};
				if(n=='#3399FF'){
					num++;
				};
				if(n=='#EE5555'){
					num--;
				};
				if(num>0){
					color='#3399FF';
				};
				if(num<0){
					color='#EE5555';
				};
				return color;
			};
		},
		chartuser(){
			let names=[];
			for(let user of JSON.parse(this.catchdata.list[0].text)){
				names.push(user.name);
			};
			let arr=[];
			for(let key in this.chartoption.legend.selected){
				arr.push({
					name:key,
					state:this.chartoption.legend.selected[key],
					now:names.indexOf(key)>=0?true:false,
				});
			};
			return arr;
		},
		partitem(){
			let item=this.catchpart.list.find((v)=>{
				return v.id==this.catchpart.active;
			});
			return item;
		},
	},
	template:`
		<div class="anisn">
			<div class="header">
				<span class="tab anitran1" v-bind:class="{active:tab=='table'}" v-on:click="tab='table'"><i class="b l anitran1"><i class="c"></i></i>表格<i class="b r anitran1"><i class="c"></i></i></span>
				<span class="tab anitran1" v-bind:class="{active:tab=='nail'}" v-on:click="tab='nail'"><i class="b l anitran1"><i class="c"></i></i>总览<i class="b r anitran1"><i class="c"></i></i></span>
				<span class="tab anitran1" v-bind:class="{active:tab=='record'}" v-on:click="tab='record'"><i class="b l anitran1"><i class="c"></i></i>记录<i class="b r anitran1"><i class="c"></i></i></span>
				<span class="tab anitran1" v-bind:class="{active:tab=='intro'}" v-on:click="tab='intro'"><i class="b l anitran1"><i class="c"></i></i>说明<i class="b r anitran1"><i class="c"></i></i></span>
				<span class="tab anitran1" v-bind:class="{active:tab=='update'}" v-on:click="tab='update'"><i class="b l anitran1"><i class="c"></i></i>日志<i class="b r anitran1"><i class="c"></i></i></span>
				<span class="blank"></span>
			</div>
			<div v-if="tab=='table'">
				<div class="control" v-if="!!catchdata.item">
					<span>记录时间</span>
					<span>{{catchdata.item.time}}</span>
				</div>
				<div class="control" v-if="finish">
					<span>标题</span>
					<input class="text" v-if="!!catchdata.item" v-model="catchdata.item.title" v-on:change="savedata" placeholder="起个名字吧">
					<input class="text" v-else v-model="title" placeholder="起个名字吧">
				</div>
				<div class="control" v-if="finish">
					<span>士气</span>
					<input class="text" v-if="!!catchdata.item" v-model="catchdata.item.flag" v-on:change="changeflag" v-on:change="savedata" placeholder="25~45之间">
					<input class="text" v-else v-model="flag" placeholder="25~45之间">
				</div>
				<div class="control" v-if="finish">
					<span>操作</span>
					<button class="btn imp" v-on:click="copy">复制</button>
					<button class="btn imp" v-on:click="catch_add">保存</button>
					<button class="btn imp" v-on:click="domtoimage">图片</button>
				</div>
				<div ref="tabletd"></div>
				<div class="initbox" v-if="false">
					<div>统计数据</div>
					<button class="btn imp" v-on:click="area_show('inp','输入从游戏中导出的数据：部落->资讯->前次突袭->复制')">从游戏取</button>
					<button class="btn imp" v-on:click="area_show('tinp','输入从表格中复制的数据，来源是之前点复制按钮出来的数据')">从表格取</button>
					<button class="btn imp" v-on:click="catch_show('inp')">从记录取</button>
				</div>
				<div class="tablebox">
					<div class="table poa">
						<table>
							<tr class="th1">
								<th class="anitran1" v-bind:style="poa2.th2">名字</th>
							</tr>
							<tr v-for="(item,index) in output">
								<td><div><font v-bind:color="ncolor(qcolor(item.qty),dcolor(item.dmgrank))">{{item.name}}</font></div></td>
							</tr>
						</table>
					</div>
					<div class="table por">
						<table>
							<tr class="anitran1" v-bind:style="poa2.th2">
								<th>id</th>
								<th class="cp" v-bind:class="{im:sort=='qsu'||sort=='qsd'}" v-on:click="qschange">次数 <span v-if="sort=='qsu'">▲</span><span v-else>▼</span></th>
								<th>总伤(M)</th>
								<th class="cp" v-bind:class="{im:sort=='dsu'||sort=='dsd'}" v-on:click="dschange">排名 <span v-if="sort=='dsu'">▼</span><span v-else>▲</span></th>
								<th>均伤(M)</th>
								<th class="cp" v-bind:class="{im:sort=='asu'||sort=='asd'}" v-on:click="aschange">排名 <span v-if="sort=='asu'">▼</span><span v-else>▲</span></th>
								<th>汇总</th>
							</tr>
							<tr ref="poa2top" v-for="(item,index) in output">
								<td>{{item.id}}</td>
								<td><font v-bind:color="qcolor(item.qty)">{{item.qty}}</font></td>
								<td><font v-bind:color="dcolor(item.dmgrank)">{{omit(item.dmg)}}</font></td>
								<td>
									{{item.dmgrank}}
									<span class="cu" v-if="!!item.pdmgrank&&item.pdmgrank>item.dmgrank"> ↑{{item.pdmgrank-item.dmgrank}}</span>
									<span class="cd" v-if="!!item.pdmgrank&&item.pdmgrank<item.dmgrank"> ↓{{item.dmgrank-item.pdmgrank}}</span>
								</td>
								<td>
									{{omit(item.avg)}}
									<span class="cu" v-if="!!item.pavg&&(item.pavg/(dis.flag/100+1.65)*(flag/100+1.65))<item.avg"> ↑{{omit(item.avg-(item.pavg/(dis.flag/100+1.65)*(flag/100+1.65)))}}</span>
									<span class="cd" v-if="!!item.pavg&&(item.pavg/(dis.flag/100+1.65)*(flag/100+1.65))>item.avg"> ↓{{omit((item.pavg/(dis.flag/100+1.65)*(flag/100+1.65))-item.avg)}}</span>
								</td>
								<td>
									{{item.avgrank}}
									<span class="cu" v-if="!!item.pavgrank&&item.pavgrank>item.avgrank"> ↑{{item.pavgrank-item.avgrank}}</span>
									<span class="cd" v-if="!!item.pavgrank&&item.pavgrank<item.avgrank"> ↓{{item.avgrank-item.pavgrank}}</span>
								</td>
								<td>
									<span v-if="index==0">人数</span>
									<span v-if="index==1">{{output.length}}</span>
									<span v-if="index==2">次数</span>
									<span v-if="index==3">{{maxqty}}</span>
									<span v-if="index==4">均总伤(M)</span>
									<span v-if="index==5">{{omit(admg)}}</span>
									<span v-if="index==6">均均伤(M)</span>
									<span v-if="index==7">{{omit(aavg)}}</span>
									<span v-if="index==8">满伤比</span>
									<span v-if="index==9">{{(omit(admg)/maxqty/omit(aavg)).toFixed(2)}}</span>
									<span v-if="index==10">旗子</span>
									<span v-if="index==11">{{flag}}</span>
								</td>
							</tr>
						</table>
						<div class="domtoimg anisa" ref="table" v-show="iscopy">
							<table class="anisa">
								<tr>
									<th>名字</th>
									<th>id</th>
									<th>次数</th>
									<th>总伤(M)</th>
									<th>排名</th>
									<th>均伤(M)</th>
									<th>排名</th>
									<th>汇总</th>
								</tr>
								<tr v-for="(item,index) in output">
									<td><font v-bind:color="ncolor(qcolor(item.qty),dcolor(item.dmgrank))">{{item.name}}</font></td>
									<td>{{item.id}}</td>
									<td><font v-bind:color="qcolor(item.qty)">{{item.qty}}</font></td>
									<td><font v-bind:color="dcolor(item.dmgrank)">{{omit(item.dmg)}}</font></td>
									<td>{{item.dmgrank}}</td>
									<td>{{omit(item.avg)}}</td>
									<td>{{item.avgrank}}</td>
									<td>
										<span v-if="index==0">人数</span>
										<span v-if="index==1">{{output.length}}</span>
										<span v-if="index==2">次数</span>
										<span v-if="index==3">{{maxqty}}</span>
										<span v-if="index==4">均总伤(M)</span>
										<span v-if="index==5">{{omit(admg)}}</span>
										<span v-if="index==6">均均伤(M)</span>
										<span v-if="index==7">{{omit(aavg)}}</span>
										<span v-if="index==8">满伤比</span>
										<span v-if="index==9">{{(omit(admg)/maxqty/omit(aavg)).toFixed(2)}}</span>
										<span v-if="index==10">旗子</span>
										<span v-if="index==11">{{flag}}</span>
									</td>
								</tr>
							</table>
						</div>
					</div>
					<div class="blank" v-if="output.length==0">无数据</div>
					<div class="logo">tt2raid {{updatetext[0].title}} by.玖鱼</div>
				</div>
			</div>
			<div v-if="tab=='nail'">
				<div class="control">
					<button class="btn" v-on:click="chartshow">均伤图表</button>
					<button class="btn" v-on:click="belowshow">贡献排名</button>
					<button class="btn" v-if="isbelow" v-on:click="belowtoimg">图片</button>
				</div>
				<div class="chartuser">
					<div class="slied" v-if="ischart&&!ischartuser" v-on:click="ischartuser=true">展开筛选项 ▼</div>
					<div class="slied" v-if="ischart&&ischartuser" v-on:click="ischartuser=false">收起筛选项 ▲</div>
					<div class="oper" v-if="ischartuser"><div v-on:click="chartusercheckall">全选</div><div v-on:click="chartuserchecknotall">全不选</div></div>
					<div class="title" v-if="ischartuser">在部落内</div>
					<div class="user" v-if="ischartuser&&ischart&&!!chartoption">
						<div v-for="item in chartuser" v-bind:class="{active:item.state}" v-if="item.now" v-on:click="chartdatashow(item.name)">{{item.name}}</div>
					</div>
					<div class="title" v-if="ischartuser">离开部落</div>
					<div class="user" v-if="ischartuser&&ischart&&!!chartoption">
						<div v-for="item in chartuser" v-bind:class="{active:item.state}" v-if="!item.now" v-on:click="chartdatashow(item.name)">{{item.name}}</div>
					</div>
					<div class="slied" v-if="ischart&&ischartuser" v-on:click="ischartuser=false">收起筛选项 ▲</div>
				</div>
				<div class="chartcon" ref="chart" v-if="ischart"></div>
				<div class="belowcon" v-if="isbelow">
					<div class="table domtoimg anisa" ref="below">
						<table class="anisa">
							<tr>
								<th>排名</th>
								<th>名字</th>
								<th>id</th>
								<th>总均伤(M)</th>
								<th>总贡献</th>
							</tr>
							<tr v-for="(item,index) in belowdata">
								<td>{{index+1}}</td>
								<td>{{item.name}}</td>
								<td>{{item.id}}</td>
								<td>{{omit(item.avg)}}</td>
								<td>{{item.num}}</td>
							</tr>
						<table>
					</div>
				</div>
			</div>
			<div v-if="tab=='record'">
				<div class="control">
					<button class="btn" v-on:click="creatpart">新建分组</button>
					<button class="btn" v-if="!!catchpart.active" v-on:click="delpart">删除分组</button>
				</div>
				<div class="partbtn" v-if="catchpart.list.length>1">
					<button v-for="item in catchpart.list" v-bind:class="{active:catchpart.active==item.id}" v-on:click="changepart(item.id)">{{item.name}}</button>
				</div>
				<div class="control">
					<button class="btn" v-on:click="catch_in">导入记录</button>
					<button class="btn" v-on:click="catch_out" v-if="catchdata.list.length>0">导出记录</button>
				</div>
				<div class="catchcon">
					<div class="dd" v-for="(item,index) of catchdata.list">
						<div class="sort">
							<i class="l" v-on:click="catchsp(index)">↿</i>
							<i class="r" v-on:click="catchsn(index)">⇂</i>
						</div>
						<div class="info">
							<div class="title">{{item.title}}</div>
							<div class="more">{{item.time}}</div>
							<div class="more">+{{item.flag}}%士气</div>
						</div>
						<div class="oper">
							<i class="w" v-on:click="catch_del(index,item)">✕</i>
						</div>
					</div>
					<div class="blank" v-if="catchdata.list.length==0">无记录</div>
				</div>
			</div>
			<div v-if="tab=='intro'">
				<div class="introcon">
					<div>
						<div class="p">• 本功能可以从游戏中导入突袭数据，处理后已表格形式展示统计结果。</div>
						<div class="p">• 有3种导入方式：导入游戏中的突袭数据、导入从本功能复制出来的数据、导入保存在本功能记录中的数据。</div>
						<div class="p">• 展示统计结果后可以再和另一条数据进行对比，对比项有总伤排名、均伤、均伤排名。</div>
						<div class="p">• 对比有2种导入方式：导入从本功能复制出来的数据、导入保存在本功能记录中的数据。</div>
						<div class="p">• 展示统计结果后可以把数据复制出来，粘贴到excel中备份，也可以直接保存到记录中，记录中的数据可以随时导入导出。</div>
						<div class="p">• 展示统计结果后可以把数据保存成图片。</div>
					</div>
				</div>
			</div>
			<div v-if="tab=='update'">
				<div class="introcon">
					<div v-for="item in updatetext">
						<div class="h2">{{item.title}}</div>
						<div class="p" v-for="con in item.con">{{con}}</div>
					</div>
				</div>
			</div>
			<div class="floatbtn" v-if="tab=='table'" v-bind:class="{show:inpshow}">
				<div class="lv2 anitran1" v-on:click="area_show('inp','输入从游戏中导出的数据：部落->资讯->前次突袭->复制')">-><span>从游戏取</span></div>
				<div class="lv2 anitran1" v-on:click="area_show('tinp','输入从表格中复制的数据，来源是之前点复制按钮出来的数据')">-><span>从表格取</span></div>
				<div class="lv2 anitran1" v-on:click="catch_show('inp')">-><span>从记录取</span></div>
				<div class="lv1" v-on:click="inpshow=!inpshow">统计<br>数据</div>
			</div>
			<div class="floatbtn dis" v-if="tab=='table'&&finish" v-bind:class="{show:disshow}">
				<div class="lv2 anitran1" v-on:click="area_show('tdis','输入对比数据，来源是之前点复制按钮出来的数据')">-><span>从表格取</span></div>
				<div class="lv2 anitran1" v-on:click="catch_show('dis')">-><span>从记录取</span></div>
				<div class="lv1" v-on:click="disshow=!disshow">对比<br>数据</div>
			</div>
			<div class="catchbox anitran1" v-bind:class="{show:catchdata.show}">
				<i class="close" v-on:click="catchdata.show=false">✕</i>
				<div class="con anitran1" v-bind:class="{show:catchdata.show}">
					<div class="title">分组：{{partitem.name}}</div>
					<div class="end" v-if="catchdata.list.length>0">到顶了</div>
					<div class="dd" v-for="(item,index) of catchdata.list" v-bind:class="{active:!!catchdata.item&&catchdata.item.time==item.time}" v-on:click="catch_get(index,item)">
						<span>{{item.title}} (+{{item.flag}}%)</span>
					</div>
					<div class="end" v-if="catchdata.list.length==0">无记录</div>
					<div class="end" v-if="catchdata.list.length>0">到底了</div>
				</div>
			</div>
			<div class="areabox" v-if="areabox.show">
				<i class="close" v-on:click="areabox.show=false">✕</i>
				<div class="con">
					<div class="inputbox">
						<textarea class="input" ref="input" v-model="areabox.text" v-bind:placeholder="areabox.hold"></textarea>
					</div>
					<div class="oper">
						<button class="btn imp" v-on:click="areabox_sure">确定</button>
					</div>
				</div>
			</div>
		</div>
	`,
	watch:{
		tab(e){
			if(!!this.chart){
				this.chart.dispose();
				this.ischart=false;
			};
			if(e=='table'){
				setTimeout(()=>{
					this.pageobs.observe(this.$refs.tabletd);
				},0);
			};
		},
	},
	methods: {
		start(input) {
			this.title='';
			this.catchdata.item=null;
			this.flag='25';
			this.sort='dsd';
			this.output=[];
			let input_td=input.split('\n');
			let input_th=input_td.shift();
			let totaldmg_json={};
			for(let item of input_td){
				let arr=item.split(',');
				if(arr.length>1){
					if(!!!totaldmg_json[arr[1]]){
						totaldmg_json[arr[1]]={
							name:arr[0],
							qty:parseInt(arr[2]),
							dmg:0,
						};
					};
					totaldmg_json[arr[1]].dmg+=parseFloat(arr[5]);
				};
			};
			for(let index in totaldmg_json){
				this.output.push({
					id:index,
					name:totaldmg_json[index].name,
					qty:totaldmg_json[index].qty,
					dmg:totaldmg_json[index].dmg,
					avg:totaldmg_json[index].qty>0?totaldmg_json[index].dmg/totaldmg_json[index].qty:0,
				});
			};
			this.output.sort(function (a,b){
				return b.avg-a.avg;
			});
			for(let index in this.output){
				this.output[index].avgrank=parseInt(index)+1;
			};
			this.output.sort(function (a,b){
				return b.dmg-a.dmg;
			});
			for(let index in this.output){
				this.output[index].dmgrank=parseInt(index)+1;
			};
			if(this.output.length>0){
				this.finish=true;
				setTimeout(()=>{
					this.pageobs.observe(this.$refs.tabletd);
				},0);
			}else{
				alert('数据格式错误，无法处理');
			};
		},
		qschange(){
			if(this.sort=='qsd'){
				this.sort='qsu';
				this.output.sort(function (a,b){
					return a.qty-b.qty;
				});
			}else{
				this.sort='qsd';
				this.output.sort(function (a,b){
					return b.qty-a.qty;
				});
			};
		},
		dschange(){
			if(this.sort=='dsd'){
				this.sort='dsu';
				this.output.sort(function (a,b){
					return a.dmg-b.dmg;
				});
			}else{
				this.sort='dsd';
				this.output.sort(function (a,b){
					return b.dmg-a.dmg;
				});
			};
		},
		aschange(){
			if(this.sort=='asd'){
				this.sort='asu';
				this.output.sort(function (a,b){
					return a.avg-b.avg;
				});
			}else{
				this.sort='asd';
				this.output.sort(function (a,b){
					return b.avg-a.avg;
				});
			};
		},
		copy(){
			this.iscopy=true;
			setTimeout(()=>{
				window.getSelection().removeAllRanges();
				let range = document.createRange();
				range.selectNode(this.$refs.table);
				window.getSelection().addRange(range);
				document.execCommand("copy");
				window.getSelection().removeAllRanges();
				this.iscopy=false;
				alert('复制了');
			},0);
		},
		copy2(){
			// 获取表格元素
			let table = this.$refs.table;
			// 获取表格行数和列数
			let rows = table.rows.length;
			let cols = table.rows[0].cells.length;
			// 拼接表格数据
			let data = "";
			for (let i = 0; i < rows; i++) {
				for (let j = 0; j < cols; j++) {
					// 获取单元格内容
					let cell = table.rows[i].cells[j].innerText;
					// 添加制表符和换行符
					data += cell + (j < cols - 1 ? "\t" : "\n");
				}
			}
			// 调用navigator.clipboard.writeText()方法，将拼接好的数据写入到剪贴板中
			navigator.clipboard.writeText(data).then(
				function () {
					// 复制成功时执行的回调函数
					alert("复制成功");
				},
				function (err) {
					// 复制失败时执行的回调函数
					alert("复制失败: ", err);
				}
			);
		},
		changeflag(){
			this.flag=this.catchdata.item.flag;
		},
		savedata(){
			let list=this.catchpart.list.find((v)=>{
				return v.id==this.catchpart.active;
			});
			list.list=this.catchdata.list;
			localStorage.setItem('catchpart',JSON.stringify(this.catchpart));
		},
		inp_start(input){
			this.title='';
			this.catchdata.item=null;
			this.flag='25';
			this.sort='dsd';
			this.output=[];
			let input_td=input.split('\n');
			let input_th=input_td.shift();
			for(let i in input_td){
				let arr=input_td[i].split('\t');
				if(arr.length>1){
					if(i==11){
						this.flag=arr[7];
					};
					this.output.push({
						id:arr[1],
						name:arr[0],
						qty:parseFloat(arr[2]),
						dmg:parseFloat(arr[3])*1000000,
						dmgrank:parseFloat(arr[4]),
						avg:parseFloat(arr[5])*1000000,
						avgrank:parseFloat(arr[6]),
					});
				};
			};
			this.finish=true;
			setTimeout(()=>{
				this.pageobs.observe(this.$refs.tabletd);
			},0);
		},
		dis_start(input){
			let input_td=input.split('\n');
			let input_th=input_td.shift();
			let disoutput=this.output;
			bool=true;
			for(let i in input_td){
				let arr=input_td[i].split('\t');
				if(arr.length>1){
					if(i==11){
						this.dis.flag=arr[7];
					};
					let player=disoutput.find((v)=>{return v.id==arr[1]});
					if(!!player){
						bool=false;
						player.pdmg=parseFloat(arr[3])*1000000;
						player.pdmgrank=parseFloat(arr[4]);
						player.pavg=parseFloat(arr[5])*1000000;
						player.pavgrank=parseFloat(arr[6]);
					};
				};
			};
			this.output=[];
			this.output=disoutput;
			if(bool){
				alert('数据格式错误，无法处理');
			};
		},
		catch_show(type){
			this.catchdata.type=type;
			this.catchdata.show=true;
		},
		catch_add(){
			let output=[];
			for(let item of this.output){
				output.push({
					id:item.id,
					name:item.name,
					qty:item.qty,
					dmg:item.dmg,
					dmgrank:item.dmgrank,
					avg:item.avg,
					avgrank:item.avgrank,
				});
			};
			this.catchdata.list.unshift({
				title:this.title||JSON.stringify(new Date()).replace(/\"/g, "").replace(/T/g, " ").replace(/Z/g, ""),
				time:JSON.stringify(new Date()).replace(/\"/g, "").replace(/T/g, " ").replace(/Z/g, ""),
				text:JSON.stringify(output),
				flag:this.flag,
			});
			this.savedata();
			alert('保存到记录了');
		},
		catch_del(v,n){
			let bool=confirm('确定要删除'+n.time+'这条记录么？');
			if(bool){
				this.catchdata.list.splice(v, 1);
			};
			this.savedata();
		},
		catch_get(v,n){
			switch(this.catchdata.type){
				case 'inp' :
				this.catchdata.item=n;
				this.title=n.title;
				this.output=JSON.parse(n.text);
				this.flag=n.flag;
				this.finish=true;
				this.inpshow=false
				this.disshow=false
				this.catchdata.show=false;
				setTimeout(()=>{
					this.pageobs.observe(this.$refs.tabletd);
				},0);
				break;
				case 'dis' :
				let input=JSON.parse(n.text);
				for(let item of input){
					let player=this.output.find((v)=>{return v.id==item.id});
					if(!!player){
						player.pdmg=item.dmg;
						player.pdmgrank=item.dmgrank;
						player.pavg=item.avg;
						player.pavgrank=item.avgrank;
					};
				};
				this.dis.flag=n.flag;
				this.inpshow=false
				this.disshow=false
				this.catchdata.show=false;
				break;
				default:
				alert('异常操作');
			};
		},
		area_show(type,hold){
			this.areabox.type=type;
			this.areabox.hold=hold;
			this.areabox.text='';
			this.areabox.show=true;
			setTimeout(()=>{
				this.$refs.input.focus();
			},0);
		},
		areabox_sure(){
			if(!!!this.areabox.text){
				return false;
			};
			switch(this.areabox.type){
				case 'inp' :
				this.start(this.areabox.text);
				this.inpshow=false
				this.disshow=false
				this.areabox.show=false;
				break;
				case 'tinp' :
				this.inp_start(this.areabox.text);
				this.inpshow=false
				this.disshow=false
				this.areabox.show=false;
				break;
				case 'tdis' :
				this.dis_start(this.areabox.text);
				this.inpshow=false
				this.disshow=false
				this.areabox.show=false;
				break;
				default:
				alert('异常操作');
			};
		},
		catchsp(index){
			if(index>0){
				let i = this.catchdata.list.splice(index, 1);
				this.catchdata.list.splice(index-1, 0, i[0]);
				this.savedata();
			};
		},
		catchsn(index){
			if(index<this.catchdata.list.length-1){
				let i = this.catchdata.list.splice(index, 1);
				this.catchdata.list.splice(index+1, 0, i[0]);
				this.savedata();
			};
		},
		catch_in(){
			let file=document.createElement("input");
			file.type="file";
			file.accept=".txt";
			file.onchange=()=>{
				let reader = new FileReader();
				reader.readAsText(file.files[0]);
				reader.onload = (e) =>{
					let data;
					try{
						data=JSON.parse(decodeURIComponent(atob(e.target.result)));
					}catch(e){};
					if(!!!data){
						alert('数据异常');
						return false;
					};
					this.partitem.list=data;
					this.catchdata.list=this.partitem.list;
					this.savedata();
					alert('导入成功');
				}
			};
			file.click();
		},
		catch_out(){
			let list=this.catchpart.list.find((v)=>{
				return v.id==this.catchpart.active
			});
			const stringData = btoa(encodeURIComponent(JSON.stringify(this.catchdata.list)));
			const blob = new Blob([stringData], {
				type: "text/plain;charset=utf-8"
			});
			const objectURL = URL.createObjectURL(blob);
			const aTag = document.createElement('a');
			aTag.href = objectURL;
			aTag.download = 'tt2raid_catch_'+list.name+'_'+JSON.stringify(new Date()).replace(/\"/g, "").replace(/T/g, "_").replace(/:/g, "").replace(/\./g, "").replace(/Z/g, "").replace(/ /g, "")+'.txt';
			aTag.click();
			URL.revokeObjectURL(objectURL);
		},
		domtoimage(){
			this.iscopy=true;
			domtoimage.toBlob(this.$refs.table).then((blob)=>{
				this.iscopy=false;
				const objectURL = URL.createObjectURL(blob);
				const aTag = document.createElement('a');
				aTag.href = objectURL;
				aTag.download = 'tt2raid_img_'+JSON.stringify(new Date()).replace(/\"/g, "").replace(/T/g, "_").replace(/:/g, "").replace(/\./g, "").replace(/Z/g, "").replace(/ /g, "")+'.png';
				aTag.click();
				URL.revokeObjectURL(objectURL);
			});
		},
		chartshow(){
			if(this.ischart){
				this.chart.dispose();
				this.ischart=false;
				return false;
			};
			this.ischart=true;
			setTimeout(()=>{
				this.chart=echarts.init(this.$refs.chart, null, { renderer: 'svg' });
				this.chartoption = {
					grid:{
						top:60,
						bottom:20,
						left:20,
						right:20,
					},
					legend: {
						show:false,
						selected:{
						},
					},
					tooltip: {
						trigger: 'axis'
					},
					dataZoom:[
						{},
						{
							type:'slider',
							// handlePosition:'inside',
							handleStyle: { borderWidth: 4 },
							brushSelect:false,
							handleSize:'200%',
						}
					],
					xAxis: {
						type: 'category',
						data: [],
						boundaryGap: false,
					},
					yAxis: {
						type: 'value'
					},
					series: [{
						name:'平均值',
						type:'line',
						data:[],
						lineStyle:{
							type:'dashed',
						},
					}]
				};
				let times=[];
				for(let item of this.catchdata.list){
					times.unshift(item);
				};
				let firstp={};
				let zoomp=0;
				for(let list in times){
					this.chartoption.xAxis.data.push(times[list].title);
					let avgtotal=0;
					for(let user of JSON.parse(times[list].text)){
						let s=this.chartoption.series.find((v)=>{
							return v.id==user.id;
						});
						if(!!!s){
							let data=[];
							data[list]=parseFloat((user.avg/1000000).toFixed(2));
							this.chartoption.series.push({
								id:user.id,
								name:user.name,
								data: data,
								type:'line',
								label:{
									show:true,
									position:'right',
									// formatter:'{a}',
									formatter: function (params) {
										let z;
										if(parseInt(firstp[user.id])<zoomp){
											if(parseInt(firstp[user.id])>0){
												z=zoomp;
											}else{
												z=parseInt(firstp[user.id])+zoomp;
											};
										}else{
											z=parseInt(firstp[user.id]);
										};
										if(params.dataIndex==z){
											return params.seriesName; 
										}else{
											return '';
										};
									},
								},
							});
							firstp[user.id]=list;
						}else{
							s.name=user.name;
							s.data[list]=parseFloat((user.avg/1000000).toFixed(2));
						};
						avgtotal+=parseFloat((user.avg/1000000).toFixed(2));
					};
					avgtotal=parseFloat((avgtotal/JSON.parse(times[list].text).length).toFixed(2));
					this.chartoption.series[0].data.push(avgtotal);
				};
				let chartdata={};
				let names=[];
				for(let user of JSON.parse(this.catchdata.list[0].text)){
					names.push(user.name);
				};
				for(let item of this.chartoption.series){
					if(item.name!='平均值'){
						if(names.indexOf(item.name)>=0){
							chartdata[item.name]=true;
						}else{
							chartdata[item.name]=false;
						};
					};
				};
				this.chartoption.legend.selected=chartdata;
				this.chart.setOption(this.chartoption);
				this.chart.on('dataZoom',(params)=>{
					zoomp=this.chart.getOption().dataZoom[1].startValue;
				});
			},0);
		},
		list_maxqty(data){
			let num=0;
			for(let item of data){
				num=Math.max(num,item.qty);
			};
			return num;
		},
		list_qcolor(data,v){
			let num=0;
			num=Math.floor((v-this.list_maxqty(data))/6)+1;
			// if(v==this.list_maxqty(data)){
			// 	num++;
			// };
			// if(v<this.list_maxqty(data)-6){
			// 	num--;
			// };
			return num;
		},
		list_dcolor(data,v){
			let num=0;
			if(v<=10){
				num++;
			};
			if(v==data.length){
				num--;
			};
			return num;
		},
		countChar(text) {
			var len = 0;
			for (var i = 0; i < text.length; i++) {
				if (text.charCodeAt(i) > 127) {
					len += 2;
				} else {
					len++;
				}
			}
			return len;
		},
		belowshow(){
			if(this.isbelow){
				this.isbelow=false;
				return false;
			};
			this.isbelow=true;
			let names={};
			let scores={};
			for(let user of JSON.parse(this.catchdata.list[0].text)){
				names[user.id]=this.countChar(user.name)<=16?user.name:user.name.substring(0,8)+'...';
			};
			for(let list of this.catchdata.list){
				let users=JSON.parse(list.text);
				for(let user of users){
					if(!!names[user.id]){
						if(!!!scores[user.id]){
							scores[user.id]={
								num:0,
								avg:0,
								count:0,
							};
						};
						scores[user.id].num+=this.list_qcolor(users,user.qty)+this.list_dcolor(users,user.dmgrank);
						scores[user.id].avg+=user.avg;
						scores[user.id].count++;
					};
				};
			};
			this.belowdata=[];
			for(let key in names){
				this.belowdata.push({
					id:key,
					name:names[key],
					num:scores[key].num,
					avg:scores[key].avg/scores[key].count,
				});
			};
			this.belowdata.sort(function (a,b){
				return b.num-a.num;
			});
		},
		belowtoimg(){
			domtoimage.toBlob(this.$refs.below).then((blob)=>{
				const objectURL = URL.createObjectURL(blob);
				const aTag = document.createElement('a');
				aTag.href = objectURL;
				aTag.download = 'tt2raid_img_'+JSON.stringify(new Date()).replace(/\"/g, "").replace(/T/g, "_").replace(/:/g, "").replace(/\./g, "").replace(/Z/g, "").replace(/ /g, "")+'.png';
				aTag.click();
				URL.revokeObjectURL(objectURL);
			});
		},
		chartdatashow(name){
			this.chartoption.legend.selected[name]=!this.chartoption.legend.selected[name];
			this.chart.setOption(this.chartoption);
		},
		chartusercheckall(){
			let names=[];
			for(let user of JSON.parse(this.catchdata.list[0].text)){
				names.push(user.name);
			};
			for(let key in this.chartoption.legend.selected){
				if(names.indexOf(key)>=0){
					this.chartoption.legend.selected[key]=true;
				};
			};
			this.chart.setOption(this.chartoption);
		},
		chartuserchecknotall(){
			for(let key in this.chartoption.legend.selected){
				this.chartoption.legend.selected[key]=false;
			};
			this.chart.setOption(this.chartoption);
		},
		creatpart(){
			let name=prompt("请输入分组名称");
			if(!!name){
				let id=parseInt(new Date().getTime()/1000);
				this.catchpart.list.push({
					id:id,
					name:name,
					list:[],
				});
				this.catchpart.active=id;
				this.catchdata.list=[];
				localStorage.setItem('catchpart',JSON.stringify(this.catchpart));
			};
		},
		delpart(){
			let bool=confirm('确定要删除'+this.partitem.name+'这个分组么？');
			if(bool){
				let i=this.catchpart.list.indexOf(this.partitem);
				this.catchpart.list.splice(i, 1);
				this.catchpart.active=this.catchpart.list[i-1].id;
				this.catchdata.list=this.partitem.list;
				this.isbelow=false;
			};
			this.savedata();
		},
		changepart(id){
			this.catchpart.active=id;
			this.catchdata.list=this.partitem.list;
			this.isbelow=false;
			localStorage.setItem('catchpart',JSON.stringify(this.catchpart));
		},
	},
	mounted(){
		// localStorage.removeItem('catchpart')
		let catchpart;
		try{
			catchpart=JSON.parse(localStorage.getItem('catchpart'));
		}catch(e){
			catchpart=null;
		}
		if(!!!catchpart){
			catchpart=null;
		};
		if(!!catchpart){
			this.catchpart=catchpart;
			this.catchdata.list=this.partitem.list;
		}else{
			let catchdata;
			try{
				catchdata=JSON.parse(localStorage.getItem('catchdata'));
			}catch(e){
				catchdata=null;
			}
			if(!!!catchdata){
				catchdata=null;
			};
			if(!!catchdata){
				this.catchpart.list[0].list=catchdata;
				this.catchdata.list=catchdata;
			};
		};
		this.pageobs = new IntersectionObserver((entries, observer) => { 
			entries.forEach(entry => {
			console.log(entry.isIntersecting);
				if (entry.isIntersecting) { //true表示从不可视状态变为可视状态
					this.poa2.show=false;
				}else{
					this.poa2.show=true;
				};
			}) 
		}, {}); 
		window.document.onscroll=()=>{
			let thh=this.$refs.poa2top[0].clientHeight;
			let top=this.$refs.poa2top[0].getBoundingClientRect().top;
			if(this.poa2.show){
				this.poa2.th2.transform='translateY('+(thh-1-top)+'px)';
			}else{
				this.poa2.th2.transform='translateY(0)';
			};
		};
		window.addEventListener('resize',()=>{
			this.chart.resize();
		});
	},
});
