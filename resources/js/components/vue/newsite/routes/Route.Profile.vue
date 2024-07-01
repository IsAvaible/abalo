<script lang="ts">
import {defineComponent} from 'vue';
import navigate from "@/util/navigate";
import {getAuthenticatedUser} from "@/util/getAuthenticatedUser";
import Card from 'primevue/card';
import Avatar from "primevue/avatar";
import Divider from "primevue/divider";
import TabView from "primevue/tabview";
import TabPanel from "primevue/tabpanel";
import Skeleton from "primevue/skeleton";
import ToggleButton from "primevue/togglebutton";
import Chart from "primevue/chart";
import AvatarGroup from "primevue/avatargroup";
import ArticleCard from "@/components/vue/newsite/articles/ArticleCard.vue";
import axios from "axios";
import Carousel from 'primevue/carousel';
import Button from "primevue/button";
import {EditPencil as IconPen, Percentage as IconPercentage, Undo as IconUndo} from "@iconoir/vue";
import Article from "@/models/Article";
import OverlayPanel from "primevue/overlaypanel";
import InputGroup from "primevue/inputgroup";
import InputNumber from "primevue/inputnumber";
import InputGroupAddon from "primevue/inputgroupaddon";

export default defineComponent({
    name: "Route.Profile.vue",
    data() {
        return {
            user: null,
            articles: [],
            loading: true,
            error: null,
            toggleValue: false,

            selectedArticle: null,
            enteredDiscount: null,
            discountError: null,

            responsiveOptions: [
                {
                    breakpoint: '1280px',
                    numVisible: 3,
                    numScroll: 3
                },
                {
                    breakpoint: '1024px',
                    numVisible: 2,
                    numScroll: 2
                },
                {
                    breakpoint: '768px',
                    numVisible: 1,
                    numScroll: 1
                }
            ]
        }
    },
    methods: {
        navigate,
        async getArticles() {
            const response = await axios.get('/api/articles/search', {params: {userIds: [this.user.id]},});
            return response.data.articles;
        },
        showDiscountDialog(event: Event, article: Article) {
            this.selectedArticle = article;
            this.enteredDiscount = article.ab_discount * 100;
            this.$refs.discountDialog.show(event);
        },
        async discountArticle(article: Article) {
            if (this.enteredDiscount == article.ab_discount * 100) {
                return;
            }
            try {
                const response = await axios.post(`/api/articles/article/${article.id}/discount`, {
                    discount: this.enteredDiscount / 100
                });
                article.ab_price = response.data.newPrice;
                article.ab_discount = this.enteredDiscount / 100;
                this.$refs.discountDialog.hide();
            } catch (e) {
                this.discountError = e.response.data.message;
            }
        }
    },
    components: {
        Card,
        Avatar,
        AvatarGroup,
        Divider,
        TabView,
        TabPanel,
        Skeleton,
        ToggleButton,
        Chart,
        Carousel,
        ArticleCard,
        OverlayPanel,
        InputGroup,
        InputNumber,
        InputGroupAddon,
        Button,
        IconPen,
        IconPercentage,
        IconUndo
    },
    async mounted() {
        try {
            this.user = await getAuthenticatedUser();
            this.articles = await this.getArticles();
        } catch (e) {
            console.error(e);
            this.error = e;
        }
        this.loading = false;
    }
})
</script>

<template>
    <div class="full-body-route p-8">
        <Card class="max-w-5xl w-[90%] grow">
            <template #title>
                <h1 class="text-4xl font-bold mb-4 text-slate-800">Profile</h1>
            </template>
            <template #content>
                <div class="flex flex-col gap-y-4">
                    <template v-if="loading">
                        <div class="flex items-center">
                            <Skeleton shape="circle" size="4rem" />
                            <div class="ml-4">
                                <Skeleton width="10rem" height="1.5rem" />
                                <Skeleton width="15rem" height="1rem" class="mt-2" />
                            </div>
                        </div>
                        <div class="flex gap-x-1">
                            <Skeleton width="7rem" height="2rem" />
                            <Skeleton width="7rem" height="2rem" />
                            <Skeleton width="7rem" height="2rem" />
                        </div>
                        <div class="flex flex-col gap-y-2">
                            <Skeleton width="100%" height="15rem" />
                            <Skeleton width="100%" height="25rem" />
                            <Skeleton width="100%" height="30rem" />
                        </div>
                    </template>
                    <div v-else-if="error" class="alert alert-error">
                        <p>An error occurred while loading the profile.</p>
                        <p>{{error}}</p>
                    </div>
                    <template v-else>
                        <div class="flex items-center gap-x-4">
                            <Avatar image="https://i.pravatar.cc/150?img=12" size="xlarge" shape="circle"/>
                            <div>
                                <h2 class="text-xl font-semibold text-slate-800">{{user.user}}</h2>
                                <p class="text-slate-700">{{user.mail}}</p>
                            </div>
                            <div class="ml-auto">
                                <p class="text-slate-700"><span class="font-semibold">Address:</span> Moonlight Avenue 14, 39192 Sparkle</p>
                                <p class="text-slate-700"><span class="font-semibold">Phone:</span> +49 123 456 789</p>
                            </div>
                        </div>
                        <TabView>
                            <TabPanel header="Details">
                            <div class="flex flex-col gap-y-4">
                                <div>
                                    <p class="text-slate-700">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deserunt eaque enim et ex obcaecati officia quaerat quia similique sit vero?</p>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-slate-800">Friends</h4>
                                    <div class="flex flex-row gap-x-4 mt-1">
                                        <AvatarGroup>
                                            <Avatar
                                                v-for="n in [1, 2, 3, 4, 5]"
                                                :key="n"
                                                :image="`https://i.pravatar.cc/150?img=${n}`"
                                                shape="circle"
                                                size="large"
                                            />
                                            <Avatar label="+2" shape="circle" size="large"/>
                                        </AvatarGroup>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-slate-800">Groups</h4>
                                    <div class="flex flex-row gap-x-4 mt-1">
                                        <AvatarGroup>
                                            <Avatar
                                                v-for="n in [14, 7, 8, 19, 10]"
                                                :key="n"
                                                :image="`https://i.pravatar.cc/150?img=${n}`"
                                                shape="circle"
                                                size="large"
                                            />
                                            <Avatar label="+4" shape="circle" size="large"/>
                                        </AvatarGroup>
                                    </div>
                                </div>
                                <div>
                                    <h4 class="text-lg font-semibold text-slate-800">My Articles</h4>
                                    <Carousel :value="articles" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
                                        <template #item="article">
                                            <div class="p-3 h-full">
                                                <ArticleCard :key="article.data.id" :article="article.data" :showCartButton="false" class="h-full">
                                                    <button
                                                        title="Apply discount"
                                                        @click="event => showDiscountDialog(event, article.data)"
                                                    >
                                                        <IconPercentage/>
                                                    </button>
                                                </ArticleCard>
                                            </div>
                                            <OverlayPanel ref="discountDialog" appendTo="body">
                                                <div class="flex flex-col gap-y-2">
                                                    <p class="font-medium text-slate-900">Apply a Discount</p>
                                                    <div class="flex gap-x-2">
                                                        <InputGroup class="max-md:w-44">
                                                            <InputNumber v-model="enteredDiscount" mode="decimal" :min="0" :max="100" :step="0.1" :maxFractionDigits="1"/>
                                                            <InputGroupAddon>
                                                                <IconPercentage/>
                                                            </InputGroupAddon>
                                                        </InputGroup>
<!--                                                        <Button class="w-16" label="Reset" v-tooltip="'Reset Discount'" outlined @click="() => enteredDiscount = selectedArticle.ab_discount * 100">-->
<!--                                                            <IconUndo/>-->
<!--                                                        </Button>-->
                                                    </div>

                                                    <div v-if="discountError" class="alert alert-error">{{discountError}}</div>
                                                    <div class="flex flex-row justify-end gap-x-2 mt-4">
                                                        <Button label="Cancel" @click="$refs.discountDialog.hide" outlined/>
                                                        <Button label="Apply" @click="() => discountArticle(selectedArticle)"/>
                                                    </div>
                                                </div>
                                            </OverlayPanel>
                                        </template>
                                    </Carousel>
                                </div>
                                <Chart
                                    type="bar"
                                    :data="{
                                        labels: ['January', 'February', 'March', 'April', 'May'],
                                        datasets: [
                                            {
                                                label: 'Sales',
                                                backgroundColor: '#9f9f9f',
                                                data: [3, 5, 4, 1, 3]
                                            },
                                            {
                                                label: 'Views',
                                                backgroundColor: '#4d4d4d',
                                                data: [7, 8, 5, 8, 6]
                                            }
                                        ]
                                    }"
                                />
                            </div>
                            </TabPanel>
                            <TabPanel header="Settings">
                                <div class="flex flex-col gap-y-4 p-4">
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium adipisci animi aperiam assumenda at corporis cum cupiditate dolorem dolorum eaque est fugit illo ipsa ipsam magni necessitatibus officia officiis optio perspiciatis praesentium provident quae qui repellendus sunt suscipit unde voluptas, voluptates. Accusamus atque corporis doloremque eos eum in inventore ipsa iure laboriosam odio odit porro quos reprehenderit repudiandae similique sint tempore, voluptates. Ab at deleniti distinctio et impedit quasi rerum tenetur vel? Adipisci alias architecto commodi culpa, cupiditate deserunt dolores eaque, earum eius, eos esse et eveniet excepturi expedita fugit inventore laboriosam laudantium magnam magni molestias mollitia nobis non numquam obcaecati odio perferendis quaerat quod quos reiciendis reprehenderit repudiandae totam vel veniam veritatis voluptas voluptate voluptatum. Ad delectus ducimus esse excepturi, impedit mollitia non placeat quas quod, recusandae repellat ut vitae! Aliquam amet, aperiam aspernatur consequuntur, ducimus est iure libero, nulla odio quam recusandae similique. Dolore earum eum fugit laborum nesciunt optio sed ut voluptatem voluptatum? Illum nulla quae repellat repudiandae. Aliquid blanditiis cumque cupiditate deleniti doloremque, ducimus eos et excepturi hic illum iusto molestiae mollitia nam odio odit omnis possimus qui quibusdam quidem ratione reiciendis sequi tempore unde. Architecto aut doloremque earum eveniet ipsa molestiae mollitia repellendus reprehenderit voluptatibus.
                                </div>
                            </TabPanel>
                            <TabPanel header="Activity">
                                <Chart type="bar" :data="{
                                    labels: ['January', 'February', 'March', 'April', 'May'],
                                    datasets: [
                                        {
                                            label: 'Activity',
                                            backgroundColor: '#6B7280',
                                            data: [65, 59, 80, 81, 56]
                                        }
                                    ]
                                }" />
                            </TabPanel>
                        </TabView>
                    </template>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>

</style>
