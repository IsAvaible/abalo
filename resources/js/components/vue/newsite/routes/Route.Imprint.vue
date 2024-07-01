<script lang="ts">
import {defineComponent} from 'vue';
import navigate from "@/util/navigate";


export default defineComponent({
    name: "Route.Imprint.vue",
    methods: {
        navigate
    }
})
</script>

<template>
    <div class="full-body-route p-8">
        <div class="max-w-[80ch]">
            <h1 class="text-4xl font-bold mb-4">Impressum</h1>
            <h2 class="text-xl font-semibold mb-2">Angaben gemäß § 5 TMG:</h2>
            <p class="mb-4">
                Simon Felix Conrad<br>
                Dennis Costa Wolff<br>
                FH Aachen<br>
                Goethestraße 1<br>
                52064 Aachen
            </p>
            <h2 class="text-xl font-semibold mb-2">Kontakt:</h2>
            <p class="mb-4">
                E-Mail: <a href="mailto:info@abalo-studentenprojekt.de" class="text-blue-500 hover:underline">info@abalo-studentenprojekt.de</a>
            </p>
            <h2 class="text-xl font-semibold mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:</h2>
            <p class="mb-4">
                Simon Felix Conrad<br>
                Dennis Costa Wolff<br>
                FH Aachen<br>
                Goethestraße 1<br>
                52064 Aachen
            </p>
            <h2 class="text-xl font-semibold mb-2">Haftungsausschluss:</h2>
            <h3 class="text-lg font-semibold mb-2">Haftung für Inhalte</h3>
            <p class="mb-4">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
            </p>
            <p class="mb-4">
                Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
            </p>
            <h3 class="text-lg font-semibold mb-2">Haftung für Links</h3>
            <p class="mb-4">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
            </p>
            <p class="mb-4">
                Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
            </p>
            <h3 class="text-lg font-semibold mb-2">Urheberrecht</h3>
            <p class="mb-4">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet.
            </p>
            <p class="mb-4">
                Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
            </p>
            <h3 class="text-lg font-semibold mb-2">Datenschutz</h3>
            <p class="mb-4">
                Informationen zum Datenschutz finden Sie in unserer <a href="/newsite/privacy" @click.prevent="this.navigate($event.currentTarget)" class="text-blue-500 hover:underline">Datenschutzerklärung</a>.
            </p>
            <p class="text-sm text-gray-600 mt-4">
                Dieses Impressum wurde erstellt im Rahmen des Moduls "DBWT 2 (Datenbanken und Web-Technologien 2)" an der FH Aachen und ist Bestandteil des Projekts "Abalo", einem simplen C2C Webshop, entwickelt von Simon Felix Conrad und Dennis Costa Wolff.
            </p>
        </div>
    </div>
</template>

<style scoped>

</style>
