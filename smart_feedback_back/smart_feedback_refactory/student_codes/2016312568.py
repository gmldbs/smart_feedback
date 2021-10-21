import time, sys, base64
sys.stdout=open('smart_feedback_refactory/student_codes/2016312568_output.out', 'w', encoding='utf8')
def search(x, seq):
    for i, e in enumerate(seq):
        if x < e:
            return i
    return len(seq)

