var vreticle = {
    REVISION: '1'
};

vreticle.Reticle = function(camera, duration) {
    var new_reticle = {};

    new_reticle.default_material = function() {
        return new THREE.MeshNormalMaterial();
    };
    new_reticle.get_random_hex_color = function() {
        return '#' + ('00000' + (Math.random() * (1 << 24) | 0).toString(16)).slice(-6);
    };
    new_reticle.get_random_hex_material = function() {
        return new THREE.MeshBasicMaterial({
            color: this.get_random_hex_color(),
            transparent: true,
            opacity: 0.8
        });
    };
    new_reticle.create_web_material = function(url_in) {
        var new_texture = THREE.ImageUtils.loadTexture(url_in);
        new_texture.minFilter = THREE.NearestFilter
        new_texture.magFilter = THREE.LinearFilter;

        return new THREE.MeshBasicMaterial({
            map: new_texture
        });
    };
    new_reticle.create_default_object = function(position_in, face_camera, side_length, image_url_in, sphere) {
        if (side_length == undefined) {
            side_length = .2;
        }
        if (sphere == undefined) {
            sphere = false;
        }
        //action
        if (image_url_in != undefined) {
            var temp_material = new_reticle.create_web_material(image_url_in);
        } else {
            temp_material = new_reticle.default_material();
        }
        if (sphere) {
            // var default_geometry = new THREE.SphereGeometry(side_length, side_length, side_length);
            var default_geometry = new THREE.CircleGeometry(side_length, 32);
        } else {
            var default_geometry = new THREE.BoxGeometry(side_length, side_length, side_length);
        }
        var default_geometry = new THREE.RingBufferGeometry(side_length, side_length * 1.5, 32, 8, 0, Math.PI * 2);
        var default_object = new THREE.Mesh(default_geometry, temp_material);
        default_object.position.x = position_in.x;
        default_object.position.y = position_in.y;
        default_object.position.z = position_in.z;
        return default_object;
    }

    new_reticle.reticle_arm_object = null;
    new_reticle.reticle_object = null;
    new_reticle.gazing_duration = duration;
    new_reticle.reticle_hit_object = null;
    new_reticle.reticle_hit_time = null;
    new_reticle.gazing_object = null;
    new_reticle.gazing_time = null;
    new_reticle.clock = null;
    new_reticle.expanded_node = null;
    new_reticle.colliders = [];
    new_reticle.init = function(camera) {
        this.create_reticle(camera);
        this.start_clock();
    };
    new_reticle.create_reticle = function(camera) {
        this.camera = camera;
        this.reticle_arm_object = new THREE.Object3D();
        this.reticle_object = this.create_default_object(new THREE.Vector3(0, 0, -1), true, .01, undefined, true);
        this.reticle_object.material.transparent = true;
        this.reticle_object.material.opacity = 0.8;
        this.reticle_arm_object.add(this.reticle_object);
        this.camera.add(this.reticle_arm_object);
    };

    new_reticle.get_reticle_position = function() {
        return new_reticle.reticle_object.position;
    }

    new_reticle.camera_ray = null

    new_reticle.get_camera_ray = function() {
        return new_reticle.camera_ray.ray;
    }

    new_reticle.detect_reticle_hit = function() {
        //hack, these values should be calculated
        var vector = new THREE.Vector3(-0.0012499999999999734, -0.0053859964093356805, 0.5);
        vector.unproject(this.camera);
        var ray = new THREE.Raycaster(this.camera.position, vector.sub(this.camera.position).normalize());

        var intersects = ray.intersectObjects(this.colliders);
        //if an object is hit

        if (intersects.length > 0) {
            //save the new hit object and time
            this.reticle_hit_object = intersects[0].object;
            this.reticle_hit_time = this.clock.getElapsedTime();
            //is the hit object gazeable
            if (this.reticle_hit_object.gazeable) {
                // this.reticle_object.material = this.get_random_hex_material();
                //check if there's a gazing object
                if (this.gazing_object != null) {
                    //if the gazing object is the same as the hit object: check to see if the elapsed time exceeds the hover duration

                    if (this.gazing_object == this.reticle_hit_object) {
                        //if it does: trigger the click

                        if (this.reticle_hit_time - this.gazing_time >= this.gazing_duration) {
                            if (this.gazing_object.ongazelong != undefined) {
                                this.reticle_object.scale.set(1.5,1.5,1.5);
                                this.gazing_object.ongazelong();
                            }
                            //reset gazing time
                            this.gazing_time = this.reticle_hit_time;
                        }
                    } else {
                        //if there is but it doesn't match the hit object: save the new hit object and time
                        // console.log("gaze out");
                        this.gazing_object = this.reticle_hit_object;
                        this.gazing_time = this.reticle_hit_time;
                        if (this.gazing_object.ongazeout != undefined) {
                            this.gazing_object.ongazeout();
                        }
                    }

                } else {
                    //if there is not: save the time and object as gazing
                    // console.log("gaze over");
                    this.gazing_object = this.reticle_hit_object;
                    this.gazing_time = this.reticle_hit_time;
                    this.reticle_object.scale.set(2,2,2);


                    if (this.gazing_object.ongazeover != undefined) {
                        this.gazing_object.ongazeover();
                    }
                }

            }
        } else {
            if (this.gazing_object != null) {
                // console.log("gaze out");
                if (this.gazing_object.ongazeout != undefined) {
                    this.gazing_object.ongazeout();
                }
                //clear gazing and hit object and times
                this.reticle_hit_object = null;
                this.reticle_hit_time = null;
                this.gazing_object = null;
                this.gazing_time = null;
                // this.reticle_object.material = this.default_material();
                this.reticle_object.scale.set(1,1,1);
            }
        }
    }

    new_reticle.remove_from_list = function(object_in, list_in) {
        var index = list_in.indexOf(object_in);
        if (index > -1) {
            console.log("removing");
            list_in.splice(index, 1);
        }
    }

    new_reticle.add_collider = function(three_object) {
        three_object.gazeable = true;
        this.colliders.push(three_object);
    };

    new_reticle.remove_collider = function(three_object) {
        three_object.gazeable = false;
        this.remove_from_list(three_object, new_reticle.colliders);
    };

    new_reticle.detect_gaze = function() {

    };

    new_reticle.reticle_loop = function() {
        this.detect_reticle_hit();
        this.detect_gaze();
    }

    new_reticle.start_clock = function() {
        this.clock = new THREE.Clock(true);
    }


    //start the reticle
    new_reticle.init(camera);
    return new_reticle;
}
