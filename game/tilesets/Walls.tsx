<?xml version="1.0" encoding="UTF-8"?>
<tileset version="1.9" tiledversion="1.9.0" name="Walls" tilewidth="8" tileheight="8" tilecount="256" columns="16">
 <image source="Walls.png" width="128" height="128"/>
 <tile id="0">
  <properties>
   <property name="bottom" type="bool" value="false"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="false"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="1">
  <properties>
   <property name="bottom" type="bool" value="false"/>
   <property name="left" type="bool" value="false"/>
   <property name="right" type="bool" value="false"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="2">
  <properties>
   <property name="bottom" type="bool" value="false"/>
   <property name="left" type="bool" value="false"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="3">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="false"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="4">
  <properties>
   <property name="bottom" type="bool" value="false"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="16">
  <properties>
   <property name="bottom" type="bool" value="false"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="false"/>
   <property name="top" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="17">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="18">
  <properties>
   <property name="bottom" type="bool" value="false"/>
   <property name="left" type="bool" value="false"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="19">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="20">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="false"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <tile id="32">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="false"/>
   <property name="top" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="33">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="false"/>
   <property name="right" type="bool" value="false"/>
   <property name="top" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="34">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="false"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="35">
  <properties>
   <property name="bottom" type="bool" value="false"/>
   <property name="left" type="bool" value="true"/>
   <property name="right" type="bool" value="true"/>
   <property name="top" type="bool" value="false"/>
  </properties>
 </tile>
 <tile id="36">
  <properties>
   <property name="bottom" type="bool" value="true"/>
   <property name="left" type="bool" value="false"/>
   <property name="right" type="bool" value="false"/>
   <property name="top" type="bool" value="true"/>
  </properties>
 </tile>
 <wangsets>
  <wangset name="walls" type="corner" tile="-1">
   <wangcolor name="wall" color="#ff0000" tile="-1" probability="1"/>
   <wangtile tileid="0" wangid="0,1,0,0,0,1,0,1"/>
   <wangtile tileid="1" wangid="0,1,0,0,0,0,0,1"/>
   <wangtile tileid="2" wangid="0,1,0,1,0,0,0,1"/>
   <wangtile tileid="16" wangid="0,0,0,0,0,1,0,1"/>
   <wangtile tileid="17" wangid="0,1,0,1,0,1,0,1"/>
   <wangtile tileid="18" wangid="0,1,0,1,0,0,0,0"/>
   <wangtile tileid="32" wangid="0,0,0,1,0,1,0,1"/>
   <wangtile tileid="33" wangid="0,0,0,1,0,1,0,0"/>
   <wangtile tileid="34" wangid="0,1,0,1,0,1,0,0"/>
   <wangtile tileid="48" wangid="0,0,0,1,0,0,0,0"/>
   <wangtile tileid="49" wangid="0,0,0,0,0,1,0,0"/>
   <wangtile tileid="50" wangid="0,1,0,0,0,1,0,0"/>
   <wangtile tileid="51" wangid="0,0,0,1,0,0,0,1"/>
   <wangtile tileid="64" wangid="0,1,0,0,0,0,0,0"/>
   <wangtile tileid="65" wangid="0,0,0,0,0,0,0,1"/>
  </wangset>
 </wangsets>
</tileset>
