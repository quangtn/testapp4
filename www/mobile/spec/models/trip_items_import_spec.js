define(['models/trip_items_import'], function(ImportModel) {
	describe("Import Model", function() {

		var importModel,
			mockData = {
				tripId: 14124,
				record_locator: "1234 5678 9012",
				last_name: "Barton"
			};

		it("should exist", function() {
			expect(ImportModel).toBeTruthy();
		});

		it("should be functional", function() {
			importModel = new ImportModel();
			expect(importModel).toBeDefined();
		});

		describe("validate", function() {

			it("should validate a pnr with white space in it", function() {
				importModel = new ImportModel();

				expect(importModel.validate(mockData)).toBeNull();
			});
		});

		describe("sanitizePNR", function() {

			it("should run PNR through it during validation", function() {
				importModel = new ImportModel(mockData);
				spyOn(importModel, 'sanitizePNR').andCallThrough();

				importModel.validate(mockData);

				expect(importModel.sanitizePNR).toHaveBeenCalledWith("1234 5678 9012");
			});

			it("should remove white space from PNRs", function() {
				var pnr = importModel.sanitizePNR("1234 5678 9012");

				expect(pnr).toBe("123456789012");
			});
		});
	});
});