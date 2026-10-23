import sys,subprocess,glob
pref,out=sys.argv[1],sys.argv[2]
fr=sorted(glob.glob(f'{sys.argv[3] if len(sys.argv)>3 else "reelframes"}/{pref}-*.png'),key=lambda x:int(x.rsplit('-',1)[1].split('.')[0]))
d=3.2; t=0.5
args=['ffmpeg','-y','-loglevel','error']
for f in fr: args+=['-loop','1','-t',str(d),'-i',f]
fc=[]; prev='0:v'
for i in range(1,len(fr)):
    off=i*(d-t)
    fc.append(f'[{prev}][{i}:v]xfade=transition=fade:duration={t}:offset={off:.2f}[v{i}]'); prev=f'v{i}'
fc.append(f'[{prev}]format=yuv420p,fps=30[out]')
args+=['-filter_complex',';'.join(fc),'-map','[out]','-c:v','libx264','-preset','medium','-crf','20','-movflags','+faststart',out]
subprocess.run(args,check=True); print(out)
