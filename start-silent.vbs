Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

currentDir = fso.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = currentDir

' Launch service-runner.bat completely hidden (0 = hidden)
WshShell.Run "cmd /c service-runner.bat", 0, False

' Wait 3 seconds for server to start, then open the browser
WScript.Sleep 3000
WshShell.Run "http://localhost:3000"
