<script lang="ts">
import {defineComponent} from 'vue'

import axios from "axios";

import {Cropper} from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';

import InputGroup from "primevue/inputgroup";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import InputNumber from "primevue/inputnumber";
import FileUpload from "primevue/fileupload";
import CascadeSelect from "primevue/cascadeselect";
import Button from "primevue/button";
import Image from "primevue/image";
import Dialog from "primevue/dialog";


import {
    Euro as IconEuro,
    Label as IconLabel,
    MediaImage as IconMediaImage,
    PageEdit as IconPageEdit
} from "@iconoir/vue";

export default defineComponent({
    name: "AddArticleForm",
    components: {
        InputGroup,
        InputGroupAddon,
        InputText,
        Textarea,
        InputNumber,
        FileUpload,
        CascadeSelect,
        Button,
        Image,
        Dialog,

        Cropper,

        IconLabel,
        IconEuro,
        IconPageEdit,
        IconMediaImage,
    },
    data() {
        return {
            categoriesTree: [],

            name: '',
            description: '',
            price: null,
            category: null,
            image: null,
            imageFile: null,
            imageSrc: null,
            cropping: false,

            loading: false,
            success: false,
            errorMessage: null,
            errors: {
                name: null,
                description: null,
                price: null,
                category: null,
                image: null,
            }
        }
    },
    props: {
        categories: {
            type: Array,
            required: true,
        }
    },
    methods: {
        async submit() {
            this.errorMessage = null;
            this.success = false;
            this.loading = true;

            const formData = new FormData();
            formData.append('name', this.name);
            formData.append('description', this.description);
            if (this.price !== null) formData.append('price', String(Math.floor(this.price * 100)));
            if (this.category !== null) formData.append('category', this.category.id);
            formData.append('image', this.imageFile);

            try {
                await axios.post('/api/articles', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                this.success = true;
            } catch (error) {
                this.errorMessage = error.message ?? 'An error occurred';

                setTimeout(() => {
                    this.errorMessage = null;
                }, 5000);

                const responseErrors = error.response.data.error;
                for (const key in this.errors) {
                    if (responseErrors.hasOwnProperty(key)) {
                        this.errors[key] = responseErrors[key].join('\n');
                    } else {
                        this.clearError(key);
                    }
                }
            }
            this.loading = false;
        },
        buildCategoriesTree(categories) {
            const map = {};
            const roots = [];

            categories.forEach(category => {
                map[category.id] = {...category, children: []};
            });

            categories.forEach(category => {
                if (category.ab_parent === null) {
                    roots.push(map[category.id]);
                } else {
                    if (map[category.ab_parent]) {
                        map[category.ab_parent].children.push(map[category.id]);
                    }
                }
            });

            return roots;
        },
        handleImageUpload(event) {
            this.imageFile = event.files[0];
            this.imageSrc = URL.createObjectURL(this.imageFile);
            this.clearError('image');
            this.cropping = true;
        },
        handleCrop() {
            const { coordinates, canvas, } = this.$refs.cropper.getResult();
            this.imageSrc = canvas.toDataURL();
            this.imageFile = this.dataURLtoFile(this.imageSrc, this.imageFile.name);
            this.cropping = false;
        },
        clearError(field: string) {
            this.errors[field] = null;
        },
        dataURLtoFile(dataurl, filename) {
            const arr = dataurl.split(',');
            const mime = arr[0].match(/:(.*?);/)[1];
            const bstr = atob(arr[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, {type: mime});
        }
    },
    mounted() {
        this.categoriesTree = this.buildCategoriesTree(this.categories)
    }
})
</script>

<template>
    <form @submit.prevent="submit">
        <Dialog v-model="cropping" header="Crop Uploaded Image" :visible="cropping" :modal="true" :draggable="false" :closable="false">
            <Cropper :src="imageSrc" @crop="cropping = false" :stencil-props="{aspectRatio: 1}" ref="cropper" class="cropper"/>
            <Button class="w-full mt-4" label="Confirm" @click="handleCrop"/>
        </Dialog>
        <div class="input-group" id="image-group">
            <label for="image">Image</label>
            <Image :src="imageSrc" alt="Your Uploaded Image" preview :pt="{image: 'rounded-xl h-[180px] aspect-square'}"
                   v-if="imageSrc"/>
            <div id="image-placeholder" v-else>
                <IconMediaImage/>
            </div>
            <FileUpload id="image" v-model="image" mode="basic" auto customUpload @uploader="handleImageUpload"
                        accept="image/*" :max-file-size="2097152"
                        :chooseLabel="imageSrc ? 'Change Image' : 'Upload Image'" uploadLabel="Upload"
                        cancelLabel="Cancel"
                        :pt="{chooseButton: 'w-full'}"
            />
            <small v-if="errors.image" class="p-error">{{ errors.image }}</small>
        </div>
        <div class="input-group">
            <label for="name">Name</label>
            <InputGroup>
                <InputGroupAddon>
                    <icon-label></icon-label>
                </InputGroupAddon>
                <InputText id="name" v-model="name" placeholder="Name" :invalid="errors.name" @input="clearError('name')"/>
            </InputGroup>
            <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
        </div>
        <div class="input-group">
            <label for="price">Price</label>
            <InputGroup>
                <InputNumber id="price" v-model="price" placeholder="Price" :max-fraction-digits="2"
                             :min-fraction-digits="2" :min="0" :invalid="errors.price" @input="clearError('price')"/>
                <InputGroupAddon>
                    <icon-euro></icon-euro>
                </InputGroupAddon>
            </InputGroup>
            <small v-if="errors.price" class="p-error">{{ errors.price }}</small>
        </div>
        <div class="input-group">
            <label for="category">Category</label>
            <CascadeSelect id="category" v-model="category" :options="categoriesTree" optionLabel="ab_name"
                           optionGroupLabel="ab_name" :optionGroupChildren="['children']"
                           placeholder="Select a category" :invalid="errors.category"
                           class="max-w-full truncate"
                           @change="clearError('category')"/>
            <small v-if="errors.category" class="p-error">{{ errors.category }}</small>
        </div>
        <div class="input-group" id="description-group">
            <label for="description">Description</label>
            <InputGroup>
                <InputGroupAddon>
                    <icon-page-edit></icon-page-edit>
                </InputGroupAddon>
                <Textarea id="description" v-model="description" placeholder="Description" rows="3"
                          :invalid="errors.description" @input="clearError('description')"/>
            </InputGroup>
            <small v-if="errors.description" class="p-error">{{ errors.description }}</small>
        </div>


        <Button type="submit" label="Submit" :loading="loading"/>

        <Transition name="fade">
            <div class="alert alert-success" v-if="success">Article added successfully</div>
        </Transition>
        <Transition name="fade">
            <div class="alert alert-error" v-if="errorMessage">{{ errorMessage }}</div>
        </Transition>
    </form>
</template>


<style scoped lang="sass">
form
    display: grid
    grid-template-columns: repeat(3, minmax(0, 1fr))
    gap: 1rem 1rem
    max-width: 700px


    .input-group
        display: grid
        gap: 0.25rem
        position: relative

    label
        font-weight: bold

    .p-error
        color: red
        font-size: 0.75rem
        position: absolute
        bottom: -1rem
        white-space: nowrap

    #description-group
        grid-column: 1 / -1

    #image-group
        grid-column: 1 / -1
        justify-self: center
        align-self: center
        gap: 0.5rem
        align-items: center
        justify-items: center

        #image-placeholder
            width: 180px
            height: 180px
            border: 1px solid #ccc
            display: grid
            place-items: center
            font-size: 2rem
            color: #ccc
            border-radius: 0.5rem

    button[type="submit"]
        grid-column: 1 / -1
        justify-self: center
        width: 100%

    .alert
        grid-column: 1 / -1
        justify-self: center


@media (max-width: 768px)
    form
        grid-template-columns: 1fr
        gap: 1rem 0
        max-width: 100%

.cropper
    width: 60svw
    height: 60svh

.fade-enter-active, .fade-leave-active
    transition: opacity 0.2s ease

.fade-enter-from, .fade-leave-to
    opacity: 0
</style>
