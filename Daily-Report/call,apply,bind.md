// call apply ����Ϊ�˽���ı�this ��ָ�� ������ͬ��ֻ�Ǵ��η�ʽ��ͬ
// call �����Զ����������ʽ���� apply ֻ������������ �ڶ�������������
let a = {
  value: 1
}
function getValue(name, age) {
  console.log(name)
  console.log(age)
  console.log(this.value)  // ������ı�this ��ָ������ͻᱨ�� ����this ָ��window
}
getValue.call(a, 'yck', '24')//  ��this ��ָ���window �ĵ��� a����������������getValue��Ҫ��
getValue.apply(a, ['yck', '24'])// ͬ�� ֻ����getValue��Ҫ�Ĳ������������ʽ����
getValue.bind(a,'yck', '24')(); // bind Ҳ��ı�this ָ�� ����Ҳ�Ƕ������ ���� �᷵��һ������ ��Ҫ�ٴε���
