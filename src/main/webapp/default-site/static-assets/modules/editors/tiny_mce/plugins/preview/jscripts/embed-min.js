function writeFlash(a){writeEmbed("D27CDB6E-AE6D-11cf-96B8-444553540000","http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0","application/x-shockwave-flash",a)
}function writeShockWave(a){writeEmbed("166B1BCA-3F9C-11CF-8075-444553540000","http://download.macromedia.com/pub/shockwave/cabs/director/sw.cab#version=8,5,1,0","application/x-director",a)
}function writeQuickTime(a){writeEmbed("02BF25D5-8C17-4B23-BC80-D3488ABDDC6B","http://www.apple.com/qtactivex/qtplugin.cab#version=6,0,2,0","video/quicktime",a)
}function writeRealMedia(a){writeEmbed("CFCDAA03-8BE4-11cf-B84B-0020AFBBCCFA","http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0","audio/x-pn-realaudio-plugin",a)
}function writeWindowsMedia(a){a.url=a.src;
writeEmbed("6BF52A52-394A-11D3-B153-00C04F79FAA6","http://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701","application/x-mplayer2",a)
}function writeEmbed(b,a,c,e){var d="",f;
d+='<object classid="clsid:'+b+'" codebase="'+a+'"';
d+=typeof(e.id)!="undefined"?'id="'+e.id+'"':"";
d+=typeof(e.name)!="undefined"?'name="'+e.name+'"':"";
d+=typeof(e.width)!="undefined"?'width="'+e.width+'"':"";
d+=typeof(e.height)!="undefined"?'height="'+e.height+'"':"";
d+=typeof(e.align)!="undefined"?'align="'+e.align+'"':"";
d+=">";
for(f in e){d+='<param name="'+f+'" value="'+e[f]+'">'
}d+='<embed type="'+c+'"';
for(f in e){d+=f+'="'+e[f]+'" '
}d+="></embed></object>";
document.write(d)
};