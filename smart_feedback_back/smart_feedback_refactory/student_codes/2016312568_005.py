import time, sys, base64
sys.stdout=open('2016312568_005_output.txt', 'w', encoding='utf8')
def search(x, seq):
    index = 0
    for i in range(0,len(seq)):
        if x > seq[i]:
            index = i + 1
    return index
print(search(3, (1, 5, 10))
)