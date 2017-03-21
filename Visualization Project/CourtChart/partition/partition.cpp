#include <iostream>
#include <fstream>
#include <cstring>
#include <stdio.h>
using namespace std;
int main()
{
    ifstream inputData("0021500492.json");
    ofstream outputData;
    bool startTag = false;
    int sequence = 1, endEventTag = 0,i ,j,length;
    char tmp, filename[21] = "0021500492_1xxx.json", seq[4],*t,
    filenameA[21] = "0021500492_0xxx.json";
    while ((tmp = inputData.get()) != EOF ){
        if (tmp == '[') {
            if (!startTag){startTag = true;}
        }
        if (startTag){
            if (tmp == '{'){
                if (!endEventTag){
                    filename[12] = '0' + sequence/100;
                    filename[13] = '0' + (sequence - 100 * (sequence/100)) /10;
                    filename[14] = '0' + sequence%10;
                    outputData.open(filename);
                    outputData.put(tmp);
                    endEventTag += 1;
                }
                else {
                    endEventTag += 1;
                    outputData.put(tmp);
                }
            }
            else if (tmp == '}'){
                endEventTag -= 1;
                outputData.put(tmp);
                if (!endEventTag) {outputData.close();sequence++;cout << sequence << endl;}
            }
            else {outputData.put(tmp);}
        }
    }
    inputData.close();
    for (i = 1; i < sequence; i++){
        filename[12] = '0' + i/100;
        filename[13] = '0' + (i - 100 * (i/100)) /10;
        filename[14] = '0' + i%10;
        inputData.open(filename);
        for (j = 0; j < 12; j++){
            inputData.get();
        }
        t = seq;
        while ((tmp = inputData.get())!= '"'){
            *t = tmp;t++;
        }
        *t = '\0';
        length = t - seq;
        if  (length == 1) {filenameA[12] = '0';filenameA[13] = '0';filenameA[14] = seq[0];}
        else if (length == 2) {filenameA[12] = '0';filenameA[13] = seq[0];filenameA[14] = seq[1];}
        else {filenameA[12] = seq[0];filenameA[13] = seq[1];filenameA[14] = seq[2];}
        inputData.close();
        rename(filename,filenameA);
    }

}
