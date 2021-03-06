unit Unit1;

interface

uses
  Winapi.Windows, Winapi.Messages, System.SysUtils, System.Variants, System.Classes, Vcl.Graphics,
  Vcl.Controls, Vcl.Forms, Vcl.Dialogs, Vcl.StdCtrls;

type
  TForm1 = class(TForm)
    Memo1: TMemo;
    Button1: TButton;
    procedure Button1Click(Sender: TObject);
  private
    { Private declarations }
  public
    { Public declarations }
  end;

var
  Form1: TForm1;

implementation

{$R *.dfm}

uses
  JSon;

procedure TForm1.Button1Click(Sender: TObject);
var
  SR: TSearchRec;
  IsFound: Boolean;
begin
  var jo := TJSONObject.Create;
  var dir := ExtractFilePath(ParamStr(0));
  var ja := TJSONArray.Create;

  IsFound := FindFirst(dir + '*.jpg', faAnyFile-faDirectory, SR) = 0;
  while IsFound do
  begin
    ja.AddElement(TJSONString.Create(SR.Name) );
    IsFound := FindNext(SR) = 0;
  end;
  FindClose(SR);


  jo.AddPair('artwork', ja);
  Memo1.Lines.Text := jo.ToJSON;
end;

end.
