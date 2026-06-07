# Duplicate CSS Selectors Analysis

Setelah melakukan analisis mendalam pada `client/src/styles/index.css` dengan mengabaikan seluruh instruksi di dalam `@media` (karena merupakan styling responsif), ditemukan **37** selector CSS yang dideklarasikan lebih dari satu kali (duplikat murni). 

Deklarasi duplikat ini berpotensi menyebabkan *styling conflicts* atau *overrides* yang sulit di-debug.

Berikut adalah daftar selektor yang duplikat beserta nomor baris tempat mereka dideklarasikan:

AMAN 1. **`body`** : baris 284, 289 
2. **`.order-items`** : baris 659, 708, 2038
3. **`.header`** : baris 968, 2789
4. **`.header-tab`** : baris 1199, 2804
5. **`.header-actions`** : baris 1241, 6512
6. **`.header-btn`** : baris 1246, 2804
7. **`.menu-header`** : baris 1760, 2850
8. **`.menu-title`** : baris 1767, 2811
9. **`.order-panel`** : baris 1940, 2793
10. **`.order-title`** : baris 1978, 2811
11. **`.order-type-tab`** : baris 2016, 2804
12. **`.discount-btn`** : baris 2201, 2804, 2977
13. **`.table-select-value`** : baris 2248, 2804
14. **`.btn-open-bill`** : baris 2262, 2804
15. **`.btn-pay-now`** : baris 2282, 2804
16. **`.empty-state`** : baris 2330, 5187
17. **`.empty-state-icon`** : baris 2351, 2818
18. **`.product-card-skeleton`** : baris 2929, 4072
19. **`.order-header .header-btn`** : baris 2940, 2945
20. **`.modal-overlay`** : baris 3124, 5194
21. **`.btn-secondary`** : baris 3709, 6780
22. **`.search-box`** : baris 5046, 5056
23. **`.loading-state`** : baris 5187, 6791
24. **`.form-group`** : baris 5243, 6339
25. **`.admin-content-grid`** : baris 5543, 6535
26. **`.admin-empty-state`** : baris 5968, 6354
27. **`.admin-search`** : baris 6017, 6027
28. **`.order-type-badge`** : baris 6116, 6525
29. **`.status-badge`** : baris 6134, 6798
30. **`.status-badge.paid`** : baris 6144, 6809
31. **`.status-badge.completed`** : baris 6144, 6809
32. **`.status-badge.pending`** : baris 6150, 6828
33. **`.status-badge.cancelled`** : baris 6155, 6816
34. **`.voucher-table th`** : baris 6661, 6667
35. **`.voucher-table td`** : baris 6661, 6676
36. **`.status-badge.active`** : baris 6698, 6809
37. **`.status-badge.expired`** : baris 6703, 6816

Berdasarkan hasil ini, masih ada banyak rule yang tercetak dua kali atau lebih dalam file CSS ini (biasanya satu di bagian awal/tengah dan satu lagi di bagian admin atau utility di bagian bawah).

Sesuai permintaan Anda, saya belum melakukan eksekusi/ekstraksi penghapusan apapun. Silakan tinjau daftar ini. Jika Anda memberikan izin, saya dapat membuat *script deduplication* tahap akhir untuk membersihkannya secara otomatis.
