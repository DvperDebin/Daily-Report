// �ֻ�ͷ���˼�������������������  ����Ӧ�ú��ٱ��ʵ��� ��ΪES6�� let �� const û��Ԥ��������
//  ��װ�Լ�����~

// Num.1
function a(){ }
var a
console.log(a)  ���ɶ��

��� 'function' �ܼ� ֻ����Ϊ ��Ԥ������ ��Ԥ������� ����Ѿ����ھͺ��ԡ� ������ʵֻ�е�1,3�д���ִ����~

// Num.2
if(!(b in window)){

var b = 1

}
console.log(b)  ���ɶ��

��� undefined  ��������ж� window�� �ǲ����� b ��������� ��if ����У� var ��һ��b�� ���b����ѭ��������������
�൱�ڴ�����

var b;
if(!(b in window)){

  b = 1

}
console.log(b) // ������� undefined

// Num.3

var c = 1;

function c(c){
  console.log(c);
  var c = 3,
}

c(2) �������ô��


���ǻᱨ�� /* ��Ԥ������ ��Ԥ������� ����Ѿ����ھͺ��� */  ������ѭ���rule

�����൱��

var c

function c(c){
  console.log(c);
  var c = 3,
}

c = 1

c(2) // 1(2)  �϶��ᱨ�� ��Ϊ 1����һ������














