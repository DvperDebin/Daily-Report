������Ĵ��淽ʽ cookie sessionstorage localstorage

localStorage  �� sessionStorage ���Ǳ��ش洢 �洢�ڿͻ���

LS�������������� ���Ǵ�����������û��ڹ������ֶ���� ���򲻻���� ��Ŵ�СΪ5M ������ͷ�������ͨ�� 

SS�����ڵ�ǰ�Ự����Ч���ر�ҳ���������������ݻᱻ��� ��Ŵ�С5M  

ע�⣺��ͬ�����֮�䲻�ܹ���LS �� SS�����ݡ�
      ��ͬ����� ��ͬ��ҳǩ���Թ���LS������ ������ͬ������²�ͬҳǩ֮�䲻���Թ���SS�����ݡ�
      


Cookie: 
document.cookie = "cookieData='cookie test data';expires="+new Date(new Date().getTime()-1).toGMTString(); // ����һ��cookie�͹���ʱ��
document.cookie // ��ȡ����cookie

Cookie �����������ڴ��������õ� �ڹ���ʱ�䵽���ʧЧ ��Ŵ�С4KB  ��ò��ܳ���20�� ����ͨ���зŵ�Request Hearder��

ԭ����Cookie �ܲ��Ѻã��Ҷ�cookie ԭ�����������˽� �������ҵ��˷�װ�û����õļ���������

// ���ù���ʱ������Ϊ��λ
function setCookie(c_name,value,expiredays){
    var exdate=new Date();
    exdate.setDate(exdate.getDate()+expiredays);
    document.cookie=c_name+ "=" +escape(value)+
    ((expiredays==null) ? "" : ";expires="+exdate.toGMTString())
  }
    setCookie('userName','xxx',1); // cookie����ʱ��Ϊ1�졣

// ���ù���ʱ������Ϊ��λ
function setCookie(c_name,value,expireseconds){
    var exdate=new Date();
    exdate.setTime(exdate.getTime()+expireseconds * 1000);
    document.cookie=c_name+ "=" +escape(value)+
    ((expireseconds==null) ? "" : ";expires="+exdate.toGMTString())
}
setCookie('userName','xxx',3600);  //cookie����ʱ��Ϊһ��Сʱ


  // ��ȡĳ��Cookie��
  function getCookie(userName){
      if (document.cookie.length>0){
        c_start=document.cookie.indexOf(userName+ "=");
        if (c_start!=-1){
          c_start=c_start + userName.length+1;
          c_end=document.cookie.indexOf(";",c_start);
          if (c_end==-1){ 
              c_end=document.cookie.length;
          }
          return unescape(document.cookie.substring(c_start,c_end));
        }
     }
    return "";
}
  var  userName = getCookie('userName');

***Cookie�ŵ㣺
   1. �߶ȵĿ���չ�ԺͿ�����
   2. ����һ����Զ������Ч��cookie ���Ա�֤�������ȡ ��ôcookieҲ����Ч��

***Cookie ȱ��
   1. ��С����4KB ������ò��ܳ���20��
   2. ��ȫ�� ��������� �Ǿͻ�������session��Ϣ

***Cookie �� Session ֮��Ĺ�ϵ 
   ���ȣ����Ǻ�sessionStorage֮��Ĺ�ϵ�� ��ΪHTTP����״̬Э�� ���Ե��û�������վʱ ���ѷ���˭��˭ ��ʱ�������Cookie��
   �ͻ����������ˣ�����˻�Ϊ������󿪱�һ���ڴ�ռ䣬����������Session���� ��������������session�洢�ͻ�����ͬһ���Ự�ڼ��һЩ������¼��
    ���̣���������һ�ν��յ�����ʱ��������һ��Session�ռ䣨������Session���󣩣�ͬʱ����һ��Session id����ͨ����Ӧͷ����ͻ��˷���Ҫ������cookie����Ӧ
	       �ͻ����յ���Ӧ���ڱ����ͻ���������һ������sessionId��cookie��Ϣ����cookie�Ĺ���ʱ��Ϊ������Ự������ҳ�����������رգ�
		   �������ͻ���ÿ�������վ��������ʱ������ͷ������ϸ�cookie��Ϣ������Session id���� Ȼ�󣬷�����ͨ����ȡ����ͷ�е�Cookie��Ϣ��ȡsessionId��
   ��������Session�Ǵ洢�ڷ�����е� Cookie�Ǵ洢�ڿͻ����е�

// �ܽ�

LS SS Cookie ��ͬ�㣺 �Ǿ��Ƕ���ͬԴ�� �� ���Ǳ���������� Ҳ���ǿͻ����У�
