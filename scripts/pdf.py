#!/usr/bin/env python3
"""Reference PDF helper.
Usage:
  pdf.py toc  <file>                 # print bookmarks/outline
  pdf.py text <file> <start> <end>   # print text of pages [start,end] (1-based)
  pdf.py png  <file> <page> <out>    # render one page to PNG
"""
import sys
import fitz


def main():
    cmd = sys.argv[1]
    path = sys.argv[2]
    doc = fitz.open(path)
    if cmd == "toc":
        toc = doc.get_toc()
        if not toc:
            print("(no embedded outline)")
        for lvl, title, page in toc:
            print(f"{'  ' * (lvl - 1)}{title}  ·p{page}")
    elif cmd == "text":
        a, b = int(sys.argv[3]), int(sys.argv[4])
        for i in range(a - 1, min(b, doc.page_count)):
            print(f"\n===== PAGE {i + 1} =====")
            print(doc[i].get_text().strip())
    elif cmd == "png":
        page = int(sys.argv[3])
        out = sys.argv[4]
        pix = doc[page - 1].get_pixmap(matrix=fitz.Matrix(2, 2))
        pix.save(out)
        print(out)


if __name__ == "__main__":
    main()
