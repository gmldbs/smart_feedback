import time, sys, base64
sys.stdout=open('output_004.out', 'w', encoding='utf8')
def search(x, seq):
    if len(seq) == 0:
        return False
    else:     
        for i in range(len(seq)):
            if x < seq[i]:
                return i
            elif seq[i] == seq[-1] and seq[i]<x:
                return i+1
            elif seq[i]<x<=seq[i+1]:
                return i+1    
        

print(search(7, [1, 5, 10])
)