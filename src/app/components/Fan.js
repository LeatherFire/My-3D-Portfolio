"use client";
import React, { useRef,useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export default function Fan(props) { 
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('models/electric_fan.glb')
  const { actions } = useAnimations(animations, group)


  useEffect(() => {
    // Örneğin "Spin" diye bir animasyon varsa:
    if (actions["Armature|Action"]) {
      actions["Armature|Action"].play();
    }
    // Diğer olası isimler: "Action", "Take 001", "fan_spin" vs.
  }, [actions]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]}>
          <group name="0a20d622ef3d4820a916482dca9888a2fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="Armature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <group name="Object_5">
                    <primitive object={nodes._rootJoint} />
                    <skinnedMesh
                      name="Object_13"
                      geometry={nodes.Object_13.geometry}
                      material={materials.fan_material}
                      skeleton={nodes.Object_13.skeleton}
                    />
                    <group name="Object_12" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
                  </group>
                </group>
                <group name="eletric_fan" rotation={[-Math.PI / 2, 0, 0]} scale={100} />
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('models/electric_fan.glb')
