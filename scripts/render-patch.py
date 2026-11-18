"""Original RERA WEB character. Run: blender -b -t 4 --python scripts/render-patch.py -- /tmp/rera-assets/patch"""
import bpy
from math import pi
from mathutils import Vector
from pathlib import Path
import os
import sys

out = Path(sys.argv[sys.argv.index('--') + 1] if '--' in sys.argv else '/tmp/rera-assets/patch')
asset_light = Path(os.environ.get('PATCH_STUDIO_HDRI', '/tmp/rera-polish/studio_small_08_1k.exr'))
out.mkdir(parents=True, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

def rgb(h):
    values = [int(h[i:i+2], 16) / 255 for i in (0, 2, 4)]
    return tuple((v / 12.92 if v < .04045 else ((v + .055) / 1.055) ** 2.4) for v in values) + (1,)

def material(name, color, roughness=.38, metal=0, emission=0):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = rgb(color)
    mat.use_nodes = True
    bs = mat.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = rgb(color)
    bs.inputs['Metallic'].default_value = metal
    bs.inputs['Roughness'].default_value = roughness
    emission_key = 'Emission Color' if 'Emission Color' in bs.inputs else 'Emission'
    bs.inputs[emission_key].default_value = rgb(color)
    bs.inputs['Emission Strength'].default_value = emission
    return mat

ceramic = material('Bone / powder-coated ceramic', 'dfd9c9', .34, .09)
ceramic_light = material('Bone / keys', 'eee8d8', .39, .02)
graphite = material('Graphite / frame', '343634', .37, .45)
black = material('Carbon / structural polymer', '17191a', .44, .16)
glass = material('Smoked screen', '191b1c', .25, .24)
metal = material('Warm machined aluminium', '7c7a70', .31, .64)
rubber = material('Rubber / grip', '242522', .61, .05)
ember = material('Ember / status indicator', 'ff5a1f', .34, .15, .15)
face = material('Warm display pixels', 'f5e8ca', .38, 0, .45)
ink = material('Dark print', '282922', .53)

root = bpy.data.objects.new('PATCH / RERA WEB', None)
bpy.context.collection.objects.link(root)
parts = []

def finish(obj, name, mat):
    obj.name = name
    obj.data.materials.append(mat)
    obj.parent = root
    parts.append(obj)
    return obj

def box(name, dims, at, mat, edge=.035, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_cube_add(size=1, location=at)
    obj = bpy.context.object
    obj.scale = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.rotation_euler = rot
    if edge:
        bevel = obj.modifiers.new('Soft machined edge', 'BEVEL')
        bevel.width = edge
        bevel.segments = 4
        bevel.limit_method = 'ANGLE'
        norm = obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
        norm.keep_sharp = True
    return finish(obj, name, mat)

def cylinder(name, radius, length, at, mat, axis='y', edge=.017):
    rotation = {'x': (0, pi/2, 0), 'y': (pi/2, 0, 0), 'z': (0, 0, 0)}[axis]
    bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=radius, depth=length, location=at, rotation=rotation)
    obj = bpy.context.object
    for poly in obj.data.polygons:
        poly.use_smooth = True
    if edge:
        bevel = obj.modifiers.new('Radiused rim', 'BEVEL')
        bevel.width = edge
        bevel.segments = 3
        obj.modifiers.new('Weighted normals', 'WEIGHTED_NORMAL')
    return finish(obj, name, mat)

def link(name, a, b, width, depth, mat, edge):
    d = Vector(b) - Vector(a)
    obj = box(name, (width, depth, d.length + .14), (Vector(a) + Vector(b))*.5, mat, edge)
    obj.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    return obj

def printed(text, at, size, mat, align='LEFT', rotation=(pi/2, 0, 0)):
    curve = bpy.data.curves.new(text, 'FONT')
    curve.body = text
    curve.align_x = align
    curve.size = size
    curve.font = mono_font
    curve.space_character = 1.05
    curve.resolution_u = 5
    obj = bpy.data.objects.new(text, curve)
    bpy.context.collection.objects.link(obj)
    obj.location = at
    obj.rotation_euler = rotation
    return finish(obj, text, mat)

def stroke(name, coords, radius, mat):
    curve = bpy.data.curves.new(name, 'CURVE')
    curve.dimensions = '3D'
    curve.bevel_depth = radius
    curve.bevel_resolution = 4
    spline = curve.splines.new('BEZIER')
    spline.bezier_points.add(len(coords) - 1)
    for p, co in zip(spline.bezier_points, coords):
        p.co = co
        p.handle_left_type = 'AUTO'
        p.handle_right_type = 'AUTO'
    obj = bpy.data.objects.new(name, curve)
    bpy.context.collection.objects.link(obj)
    return finish(obj, name, mat)

font_candidate = next((p for p in ['/tmp/fonts/LiberationMono-Bold.ttf', '/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf', '/System/Library/Fonts/SFNSMono.ttf'] if os.path.exists(p)), None)
mono_font = bpy.data.fonts.load(font_candidate, check_existing=True) if font_candidate else None
# Body, feet and rubber soles. The proportions are those of a tabletop instrument.
for s in (-1, 1):
    x = s*.49
    box('Heel / rubber sole', (.76, 1.16, .18), (x, -.18, .12), rubber, .075)
    box('Foot / ceramic shell', (.73, 1.04, .34), (x, -.18, .30), ceramic, .12)
    box('Toe / separate bumper', (.54, .10, .16), (x, -.696, .29), graphite, .037)
    for n in range(3):
        box('Toe grip', (.077, .027, .084), (x + (n-1)*.136, -.748, .29), metal, .012)
    cylinder('Ankle collar', .227, .26, (x, .02, .53), graphite, 'z')
    cylinder('Ankle piston', .15, .28, (x, .02, .61), metal, 'z')
box('Torso spine', (1.56, .94, 1.00), (0, .055, 1.06), graphite, .175)
box('Front shell', (1.67, .99, 1.01), (0, -.125, 1.10), ceramic, .19)
box('Torso lower seam', (1.54, .97, .06), (0, -.068, .734), black, .024)
box('Back I/O cover', (1.20, .13, .66), (0, .55, 1.13), graphite, .105)
for n in range(5):
    box('Rear cooling vent', (.72, .016, .028), (0, .62, .97+n*.077), black, .008)
box('Keypad recess', (1.24, .085, .50), (0, -.604, 1.121), graphite, .106)
for n in range(3):
    x = -.37+n*.37
    box('Key support', (.302, .066, .27), (x, -.654, 1.106), black, .03)
    box('Function key', (.268, .097, .233), (x, -.701, 1.119), ember if n == 2 else ceramic_light, .039)
printed('RW', (-.37, -.752, 1.093), .061, ink, align='CENTER')
printed('>_', (0, -.752, 1.093), .065, ink, align='CENTER')
printed('01', (.37, -.752, 1.093), .062, ink, align='CENTER')
printed('BUILD  /  001', (0, -.621, .816), .054, ink, align='CENTER')
cylinder('Neck lower gasket', .390, .17, (0, 0, 1.65), black, 'z')
cylinder('Neck motor collar', .30, .25, (0, 0, 1.78), metal, 'z')
cylinder('Neck top skirt', .36, .14, (0, 0, 1.89), graphite, 'z')
# A neutral hand and a slightly raised hand, with real articulated connectors.
for side, a, b, c in [(-1, (-.83, -.02, 1.42), (-1.10, -.12, .99), (-1.13, -.22, .68)), (1, (.83, -.02, 1.42), (1.15, -.12, 1.17), (1.54, -.34, 1.49))]:
    cylinder('Shoulder housing', .24, .25, (a[0], a[1], a[2]), graphite, 'x')
    cylinder('Shoulder cap', .16, .06, (a[0]+side*.149, a[1], a[2]), metal, 'x')
    link('Upper arm shell', a, b, .31, .36, ceramic, .10)
    cylinder('Elbow coupling', .139, .33, b, black, 'y')
    cylinder('Elbow fastener', .08, .033, (b[0], b[1]-.172, b[2]), metal, 'y', .007)
    link('Lower arm shell', b, c, .33, .36, ceramic, .092)
    d = (Vector(c)-Vector(b)).normalized()
    hand = Vector(c)+d*.137
    link('Wrist gasket', c, hand, .205, .23, graphite, .055)
    grip = box('Friendly two-part gripper', (.34, .29, .27), hand + d*.10, graphite, .088)
    grip.rotation_euler = d.to_track_quat('Z', 'Y').to_euler()
    box('Grip insert', (.20, .051, .11), (hand.x, hand.y-.147, hand.z+d.z*.09), rubber, .023)
# No helmet or antenna: Patch has a compact CRT-like screen, dial and side vents.
box('Head / moulded instrument housing', (2.54, 1.43, 1.70), (0, .01, 2.63), ceramic, .273)
box('Head / aft frame', (2.40, .27, 1.53), (0, .678, 2.63), graphite, .195)
box('Head / rear ceramic inset', (1.98, .18, 1.20), (0, .799, 2.63), ceramic, .17)
box('Head / lower ceramic seam', (2.24, 1.24, .062), (0, .06, 1.96), black, .026)
box('Head / top ID panel', (.89, .38, .019), (-.45, .055, 3.476), graphite, .008)
printed('RERA WEB  /  PATCH', (-.83, -.012, 3.490), .060, ceramic_light, rotation=(0,0,0))
for n in range(6):
    box('Rear grille', (1.04, .027, .036), (0, .894, 2.40+n*.078), graphite, .012)
for side in (-1, 1):
    box('Side panel / structural cover', (.082,.82,.93), (side*1.234, .206, 2.61), graphite, .038)
    for i in range(4):
        box('Side vents', (.040,.51,.041), (side*1.279, .23, 2.54+i*.123), rubber, .013)
    cylinder('Side access fastener', .070, .036, (side*1.284, -.045, 2.285), metal, 'x', .008)
box('Screen / graphite gasket', (2.20, .21, 1.21), (0, -.709, 2.69), black, .155)
box('Screen / bevel detail', (2.045, .111, 1.065), (0, -.803, 2.694), metal, .100)
box('Screen / smoked ceramic glass', (1.966, .093, .998), (0, -.852, 2.695), glass, .105)
for x in (-.372, .372):
    box('Eye / display capsule', (.177, .026, .295), (x, -.905, 2.79), face, .013)
    box('Eye / display highlight', (.043, .016, .065), (x-.033, -.927, 2.863), ceramic_light, .008)
stroke('Display / soft smile', [(-.108,-.916,2.58), (0,-.919,2.541), (.108,-.916,2.58)], .017, face)
for n in range(3):
    box('Face interface / tick', (.037,.011,.018), (.674+n*.053,-.904,2.325), metal, .004)
box('Status / ember edge', (.126, .028, .024), (-.78, -.91, 2.332), ember, .01)
printed('PATCH', (-.97, -.737, 1.995), .070, ink)
printed('01', (.87, -.738, 2.001), .062, ink)
box('Display control / dial base', (.322, .086, .162), (.64, -.724, 2.013), graphite, .039)
cylinder('Display control / knurled knob', .067, .083, (.66, -.785, 2.017), metal, 'y', .012)
box('Display control / indicator', (.020,.024,.047), (.66,-.832,2.043), ember, .006)

scene = bpy.context.scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 52
scene.cycles.use_denoising = False
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.render.resolution_percentage = 100
scene.view_settings.view_transform = 'Filmic'
scene.view_settings.look = 'Medium High Contrast'
scene.world.color = (.17,.17,.17)
scene.world.use_nodes = True
scene.world.node_tree.nodes.get('Background').inputs['Color'].default_value = (.55,.53,.48,1)
scene.world.node_tree.nodes.get('Background').inputs['Strength'].default_value = .65

def area(name, xyz, size, energy, color, target):
    lamp = bpy.data.lights.new(name, 'AREA')
    lamp.energy = energy
    lamp.shape = 'DISK'
    lamp.size = size
    lamp.color = color
    obj = bpy.data.objects.new(name, lamp)
    bpy.context.collection.objects.link(obj)
    obj.location = xyz
    obj.rotation_euler = (Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()

area('Key / large paper softbox', (-4.5,-4.5,8), 5.0, 1400, (1,.93,.82), (0,0,1.9))
area('Fill / white card', (4.4,-6,3.9), 5.0, 660, (.9,.94,1), (0,0,1.95))
area('Rim / narrow key', (2,3.7,6), 4, 1500, (1,.93,.79), (0,0,2))
cam_data = bpy.data.cameras.new('Patch / studio camera')
cam_data.type = 'ORTHO'
cam_data.ortho_scale = 4.43
camera = bpy.data.objects.new('Patch / studio camera', cam_data)
bpy.context.collection.objects.link(camera)
camera.location = (4.1,-10,5.12)
camera.rotation_euler = (Vector((.08,0,1.80))-camera.location).to_track_quat('-Z','Y').to_euler()
scene.camera = camera

# Refined neutral studio look. The downloaded environment is used for light, never shown as imagery.
scene.cycles.use_adaptive_sampling = True
scene.cycles.adaptive_threshold = .042
scene.cycles.max_bounces = 5
scene.cycles.diffuse_bounces = 3
scene.cycles.glossy_bounces = 3
scene.view_settings.look = 'Medium High Contrast'
for part in parts:
    if part.type != 'MESH':
        continue
    if part.data.materials[0] in (ceramic, ceramic_light, glass, graphite):
        for polygon in part.data.polygons:
            polygon.use_smooth = True
    for modifier in part.modifiers:
        if modifier.type == 'BEVEL' and modifier.width > .055:
            modifier.segments = 8
c_bs = ceramic.node_tree.nodes.get('Principled BSDF')
coat_weight = 'Coat Weight' if 'Coat Weight' in c_bs.inputs else 'Clearcoat'
coat_rough = 'Coat Roughness' if 'Coat Roughness' in c_bs.inputs else 'Clearcoat Roughness'
c_bs.inputs[coat_weight].default_value = .24
c_bs.inputs[coat_rough].default_value = .28
if asset_light.is_file():
    tree = scene.world.node_tree
    environment = tree.nodes.new('ShaderNodeTexEnvironment')
    environment.image = bpy.data.images.load(str(asset_light), check_existing=True)
    tree.links.new(environment.outputs['Color'], tree.nodes.get('Background').inputs['Color'])
    tree.nodes.get('Background').inputs['Strength'].default_value = .34
bpy.data.lights['Key / large paper softbox'].energy = 1040
bpy.data.lights['Fill / white card'].energy = 420
bpy.data.lights['Rim / narrow key'].energy = 820
camera.location = (3.65,-10,4.9)
focus = Vector((.04,0,1.74))
camera.rotation_euler = (focus-camera.location).to_track_quat('-Z','Y').to_euler()
cam_data.ortho_scale = 4.4

print('PATCH BAKE: geometry complete', flush=True)
if not any(flag in sys.argv for flag in ('--film-only', '--film-preview')):
    # Transparent portrait and angles stay consistent on both paper and ink surfaces.
    if not (out / 'patch-poster.png').exists():
        scene.cycles.samples = 100
        scene.render.resolution_x = 1080
        scene.render.resolution_y = 1080
        scene.render.filepath = str(out / 'patch-poster.png')
        bpy.ops.render.render(write_still=True)
    if '--poster-only' not in sys.argv:
        scene.cycles.samples = 42
        scene.render.resolution_x = 550
        scene.render.resolution_y = 550
        for i in range(16):
            root.rotation_euler.z = 2*pi*i/16
            scene.render.filepath = str(out / ('patch-%02d.png' % i))
            bpy.ops.render.render(write_still=True)
    root.rotation_euler.z = 0

if any(flag in sys.argv for flag in ('--film', '--film-only', '--film-preview')):
    plinth = material('Display base / graphite', '4d4b43', .65, .03)
    paper = material('Cyclorama / warm grey', 'b7b0a0', .76)
    # The film adds a display plinth and floor. They are excluded from the transparent exhibit.
    for obj in [
        cylinder('Display base', 1.64, .25, (0, 0, -.09), plinth, 'z', .045),
        cylinder('Machining reveal', 1.645, .016, (0, 0, -.145), metal, 'z', .004),
        box('Studio floor', (200, 200, .14), (0, 0, -.285), paper, 0),
    ]:
        obj.parent = None
    scene.render.film_transparent = False
    scene.render.resolution_percentage = 100
    scene.render.resolution_x = 960
    scene.render.resolution_y = 540
    scene.cycles.samples = 16
    scene.cycles.adaptive_threshold = .075
    scene.render.image_settings.color_mode = 'RGB'
    scene.render.fps = 12
    scene.frame_start = 1
    scene.frame_end = 72
    # In a landscape Blender camera orthographic scale is image width, not height.
    cam_data.ortho_scale = 7.95
    camera.rotation_euler = (Vector((.03, 0, 1.62)) - camera.location).to_track_quat('-Z', 'Y').to_euler()
    for frame, angle in [(1, .37), (36, -.16), (72, -.73)]:
        root.rotation_euler.z = angle
        root.keyframe_insert(data_path='rotation_euler', frame=frame)
    frames = out / 'film'
    frames.mkdir(exist_ok=True)
    scene.render.filepath = str(frames / 'frame-')
    if '--film-preview' in sys.argv:
        scene.frame_set(1)
        scene.render.filepath = str(out / 'studio-preview.png')
        bpy.ops.render.render(write_still=True)
    else:
        bpy.ops.render.render(animation=True)

root.rotation_euler.z = 0
bpy.ops.wm.save_as_mainfile(filepath=str(out / 'patch.blend'))